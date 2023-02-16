//Global Variables
board = null;
focus = null;
whiteKing = null;
blackKing = null;
blackPiecesAlive = [];
whitePiecesAlive = [];
blackPiecesDead = [];
whitePiecesDead = [];
turn = "white";


//Initializes everything needed for the game.
function initializeGame(){
    initializeBoard();
    initializeModels();
    
    startTimer();
}

function initializeBoard(){
    //2D Board
    board = new Array(8);
    for (let i=0; i<board.length; i++){
        board[i] = new Array(8);
    }


    //An array of <tr> elements to append our cells to.
    var tableRowArr = document.getElementsByClassName('row');

    //Fill in the 2D Board 
    for (let r=0; r<board.length; r++){
        //Our current <tr> to append child elements (<td>) to.
        let tr = tableRowArr[r];    

        //The cell background color for the current cell.
        let color = (r%2 === 0) ? 'light' : 'dark'; 

        for (let c=0; c<board[r].length; c++){
            //Populate each element with a Cell object.
            let cell = new Cell();
            cell.setLocation([r,c]);

            //The <td> referenced by our Cell object.
            let cellElement = cell.element; 

            //Set the background color of our <td> element and switch the color for our next cell.
            cellElement.classList.add(color), color = (color === 'dark') ? 'light' : 'dark';

            //Set the board entry to our initialized Cell object.
            board[r][c] = cell;

            //Each <td> element maps to a Cell object from board.
            cellElement.object = board[r][c];
            
            //Finally, append our cell element to the current <tr>
            tr.appendChild(cellElement);

            // onclick for cell object to Highlight cells where chess pieces at the cell can possibly move
            cellElement.onclick = function(e){
                let cell = cellElement.object;
                let pieceInCell = cell.getItem();

                // if focus is chosen
                if (focus !== null){
                    //console.log(focus);
                    unhighlightLocations(focus.listMoves());

                    // if the location is a valid move (empty cell or enemy piece)
                    if (focus.containMove(cell.getLocation())){
                        movePiece(board[focus.getLocation()[0]][focus.getLocation()[1]], cell);
                        focus = null;
                    }

                    //if location contains the same-color piece 
                    else if (focus.isSameTeamAtLocation(cell.getLocation())){
                        //if the piece is the same as focus, do not highlight cells.
                        if (focus.getLocation()[0]===cell.getLocation()[0] && focus.getLocation()[1]===cell.getLocation()[1]){
                            focus = null;
                        }
                        else{
                            //The piece is a same-color piece as focus
                            focus=pieceInCell;
                            highlightPossibleMoves(cell);
                        }
                    }

                    //if the location is not a valid move
                    else{
                        focus = null;
                    }
                }

                // if focus has not been chosen yet
                else{
                    // checks if there is a piece, it is of the correct color, and if it can even move in the first place
                    if (pieceInCell !== null && pieceInCell.getColor()===turn && pieceInCell.listMoves().length > 0){
                        highlightPossibleMoves(cell);
                        focus = pieceInCell;
                    }
                }
            };
        }
    }
}

//Moves a piece from old cell to new cell.
//Replace the content of newCell by those of oldCell
//Then set oldCell to an empty cell.
function movePiece(oldCell, newCell){
    //First move or enpassant for pawn
    var piece = oldCell.getItem();
    if (piece.getType() === 'pawn'){
        if (piece.firstMove === true){
            piece.firstMove = false;
        }
        if (Math.abs(newCell.getLocation()[0] - oldCell.getLocation()[0]) === 2){
            piece.displacementOfTwo = true;
        }
        //En Passant Capture
        /*
            The new cell is empty either means the pawn is moving forward or doing en passant.
            If it is moving forward, there will never be a piece at the previous row after the pawn has moved.
            If it is enpassant, there will be a piece at the previous row. To be consistent, we will still do the checks.
        */
        if (isEmptyAtLocation(newCell.getLocation())){
            let displacement = turn === 'white' ? 1 : -1;
            let captureLocation = [newCell.getLocation()[0] + displacement, newCell.getLocation()[1]];
            let captureCell = board[captureLocation[0]][captureLocation[1]];
            if (isInBoard(captureLocation) && !isEmptyAtLocation(captureLocation) && !piece.isSameTeamAtLocation(captureLocation) && captureCell.getItem().getType() === 'pawn'){
                eatAtCell(captureCell);
            }
        }
    }

    // Eats chess piece and removes any traces of piece in new cell
    if(newCell.getItem()!==null)
        eatAtCell(newCell);
    
    // set cells to their appropriate items
    newCell.setItem(oldCell.getItem());
    oldCell.setItem(null);

    // adds chess piece display
    newCell.getElement().appendChild(newCell.getItem().getElement());

    // sets new location for chess piece
    newCell.getItem().setLocation(newCell.getLocation());

    //In case there was a possible en passant capture and the player didnt choose it, we need to set the 
    //displaceMentOfTwo boolean to false.
    removePreviousEnpassant();

    if(newCell.getItem().getType() == 'pawn' && (newCell.getLocation()[0] == 0 ||  newCell.getLocation()[0] == 7)){
        displayPawnPromoSelection(newCell);
        //create a variable that freezes the game so opponents cant move

    }
    

    //Checks if the enemy king can be checkmated (including the check)
    //Also switches turn.
    if (turn==='white'){
        turn = 'black';
        //Checks for checkmate on the enemy king
        //console.log() can be removed after things are finalized
        if (blackKing.isCheckmated()){
            console.log("Black King is Checkmated");
        }
        else if (blackKing.isStaleMated()){
            console.log("Stalemate Reached after White has moved");
        }
    }else{
        turn = 'white';
        if (whiteKing.isCheckmated()){
            console.log("White King is Checkmated");
        }
        else if (whiteKing.isStaleMated()){
            console.log("Stalemate Reached after Black has moved");
        }
    }
}

/*
    Draw By "Three-Fold Repetition":https://www.youtube.com/watch?v=RIzV-NIWvkQ
    This rule states that if the same position is repeated 3 times (don't need to be in a row), then 
    the game ends in a draw. However, there is a bit of a nuance here.

    A position is considered to be the "same" (watch 2:00 in the link above) by these conditions:
    1. The player's pieces has the same set of rights as the previous move that the player made, INCLUDING 
    the rights of enpassant AND the right to castle. 

    This will be updated later after completing en passant and castling.
*/
function isDrawByRepetition(){
    return; //placeholder
}

//Removes any previous en passant opportunities in the current state
function removePreviousEnpassant(){
    var alivePieces = turn === 'white' ? blackPiecesAlive : whitePiecesAlive;
    for (let i=0; i<alivePieces.length; i++){
        let piece = alivePieces[i];
        if (piece.getType() === 'pawn'){
            //En Passant cannot exist when first move was used
            if (!piece.firstMove){
                piece.displacementOfTwo = false;
            }
        }
    }
}

//Helper function to intialize a chess piece
function initializePiece(location, color, type){
    var [r,c] = location;
    var piece = null;
    if (type == 'pawn'){
        piece = new Pawn(location, color, type);
    }
    else if (type == 'rook'){
        piece = new Rook(location, color, type);
    }
    else if (type == 'bishop'){
        piece = new Bishop(location, color, type);
    }
    else if (type == 'knight'){
        piece = new Knight(location, color, type);
    }
    else if (type == 'king'){
        piece = new King(location, color, type);
        if (color=="white")
            whiteKing = piece;
        else
            blackKing = piece;
    }
    else if (type == 'queen'){
        piece = new Queen(location, color, type);
    }
    else{
        //Throw an Exception.
    }

    board[r][c].setItem(piece);
    board[r][c].getElement().appendChild(piece.getElement());

    if (color === "white"){
        whitePiecesAlive.push(piece);
    }
    else if (color === "black"){
        blackPiecesAlive.push(piece);
    }
}


function initializeModels(){
    //Pawns
    for (let c=0; c<board[1].length; c++){
        initializePiece([1,c], 'black', 'pawn');
        initializePiece([6,c], 'white', 'pawn');
    }

    //Rooks
    initializePiece(board[0][0].getLocation(), 'black', 'rook');
    initializePiece(board[0][7].getLocation(), 'black', 'rook');
    initializePiece(board[7][0].getLocation(), 'white', 'rook');
    initializePiece(board[7][7].getLocation(), 'white', 'rook');

    //Knights
    initializePiece(board[0][1].getLocation(), 'black', 'knight');
    initializePiece(board[0][6].getLocation(), 'black', 'knight');
    initializePiece(board[7][1].getLocation(), 'white', 'knight');
    initializePiece(board[7][6].getLocation(), 'white', 'knight');

    //Bishops
    initializePiece(board[0][2].getLocation(), 'black', 'bishop');
    initializePiece(board[0][5].getLocation(), 'black', 'bishop');
    initializePiece(board[7][2].getLocation(), 'white', 'bishop');
    initializePiece(board[7][5].getLocation(), 'white', 'bishop');

    //Kings
    initializePiece(board[0][4].getLocation(), 'black', 'king');
    initializePiece(board[7][4].getLocation(), 'white', 'king');

    //Queens
    initializePiece(board[0][3].getLocation(), 'black', 'queen');
    initializePiece(board[7][3].getLocation(), 'white', 'queen');
}

function startTimer(){
    //TIMER
    var sec = 0;
    function pad ( val ) { return val > 9 ? val : "0" + val; }
    setInterval( function(){
        document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }, 1000);
}

// Highlight cells where chess pieces at the cell can possibly move
function highlightPossibleMoves(cell){
    var piece = cell.getItem();
    if (piece!=null){
        piece.listMoves().forEach(function(location){
            let td = board[location[0]][location[1]].getElement();
            td.style.backgroundColor = "blue";
        });
    }
}

// Will unhighlight table cells given an array of locations
function unhighlightLocations(arr){
    arr.forEach(function(location){
        let td = board[location[0]][location[1]].getElement();
        td.style.backgroundColor = "";
    });
}

// Returns true if the location is within the bounds of the board
function isInBoard(location){
    let a = location[0];
    let b = location[1];
    if (a >= 0 && a < board.length)
        if (b >= 0 && b < board.length)
            return true;
    return false;
}

// returns whether a cell at a given location has a chesspiece
function isEmptyAtLocation(location){
    return board[location[0]][location[1]].getItem() == null;
}

//Highlights available moves that a chess piece can move to
function highlightArrayOfLocations(arr){
    arr.forEach(function(location){
        let td = board[location[0]][location[1]].getElement();
        td.style.backgroundColor = "blue";
    });
}

// eats the piece at given cell
// Cell is the parameter
function eatAtCell(cell){
    let piece = cell.getItem();
    piece.setLocation(null);

    // sets deadpile to the whitepiecedead if piece is white, and vice versa
    let deadpile = piece.getColor() === "white" ? whitePiecesDead : blackPiecesDead;
    let alivepile = piece.getColor() === "white" ? whitePiecesAlive : blackPiecesAlive;
    deadpile.push(piece);
    removeObjectFromArray(alivepile, piece);
    
    // removes piece display from table cell and removes from cell object
    cell.getElement().removeChild(piece.getElement());
    cell.setItem(null);
    
    // adds dead chess piece to the dead display
    let deadpiledisplay = piece.getColor() === "white" ? "acquiredPieces" : "playerAcquiredPieces";
    document.getElementById(deadpiledisplay).appendChild(piece.getElement());
}

// removes an object from an array
function removeObjectFromArray(arr, obj){
    for (let i = 0; i < arr.length; i++){
        if (arr[i]===obj){
            arr.splice(i,1);
            return;
        }
    }
}

function displayPawnPromoSelection(cell){
    //pawn selection container is displayed
    const ChoiceDisplay = document.getElementById("ChoiceDisplay");
    ChoiceDisplay.style.display = "block";

    //get div element from html file
    const promotionSelection = document.getElementById("promotionSelection");

    //adding images w/ on click function
    let color = cell.getItem().getColor();
    //console.log(color);

    /*
        I optimized the functions a little, also looks good so far.
        Please also add a "freeze" when a player is still choosing a 
        selection (knight, bishop, rook, queen) for pawn promotion.
        
        Currently, when the pawn promotion display shows up, I can still
        move pieces around without having to select a choice for the promotion.
    */
    var queenButton = document.createElement('img');
    queenButton.src=`chess_models/chess_pieces/${color}-queen.png`;
    queenButton.addEventListener('click', function(){selected("queen", color, cell)});

    var rookButton = document.createElement('img');
    rookButton.src = `chess_models/chess_pieces/${color}-rook.png`;
    rookButton.addEventListener('click', function(){selected("rook", color, cell)})
        
    var bishopButton = document.createElement('img');
    bishopButton.src = `chess_models/chess_pieces/${color}-bishop.png`;
    bishopButton.addEventListener('click', function(){selected("bishop", color, cell)})

    var knightButton = document.createElement('img');
    knightButton.src = `chess_models/chess_pieces/${color}-knight.png`;
    knightButton.addEventListener('click', function(){selected("knight", color, cell)})
    
    promotionSelection.appendChild(queenButton);
    promotionSelection.appendChild(rookButton);
    promotionSelection.appendChild(bishopButton);
    promotionSelection.appendChild(knightButton);
}


function selected(type, color, cell){

    //remove from alivePile from corresponding colors
    if (color === "white"){
        removeObjectFromArray(whitePiecesAlive, cell.getItem());
    }
    else{
        removeObjectFromArray(blackPiecesAlive,cell.getItem());
    }
    
    //set pawn's location to null
    cell.getItem().setLocation(null);
    //remove pawn from board
    cell.getElement().removeChild(cell.getItem().getElement());
    //set cell to empty
    cell.setItem(null);

    //add "selected new piece" to replace pawn
    //Note that this method will also add the piece to white/blackPiecesAlive array.
    initializePiece(cell.getLocation(), color, type);

    //after onclick, remove pawn promotion box 
    const ChoiceDisplay = document.getElementById("ChoiceDisplay");
    ChoiceDisplay.style.display = "none";

    //remove buttons
    const promotionSelection = document.getElementById("promotionSelection");
    while (promotionSelection.firstChild){
        promotionSelection.removeChild(promotionSelection.firstChild);
    }
}