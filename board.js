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
                /*
                    A click on an empty cell either means:
                      a. No piece was clicked: nothing changes.
                      b. A piece was clicked (focus=[somePieceObject]) so this empty cell can:
                        1. Be a possible move for the clicked piece: focus=null, move the piece to this empty cell, etc.
                        2. Not be a possible move for the clicked piece: nothing changes

                    A click on a non-empty cell either means:
                      a. No piece was clicked: focus=[currentPieceObject]
                      b. A piece was clicked (focus=[clickedPieceObject]) and the current cell contains:
                         1. the same-color piece as focus: focus=[currentPieceObject]
                         2. a different-color piece as focus:
                            a. the different-color piece can be eaten: eat the different-color piece, set focus=null, etc.
                            b. the different-color piece cannot be eaten: nothing changes.
                */
                let cell = cellElement.object;
                let pieceInCell = cell.getItem();

                // if focus is chosen
                if (focus !== null){
                    unhighlightLocations(focus.listMoves());

                    // if the location is a valid move
                    if (focus.containMove(cell.getLocation())){
                        
                        // this is specifically for the pawn (MUST BE CHANGED FOR CASTLING)
                        if (focus.firstMove === true)
                            focus.firstMove = false;

                        movePiece(board[focus.getLocation()[0]][focus.getLocation()[1]], cell);

                        // switches turn to black if white and vice versa
                        turn = turn==="white" ? "black" : "white";

                        focus = null;
                    }

                    // if location is not a valid move (includes focus's original position), reset focus
                    else
                        focus = null;
                }

                // if focus has not been chosen yet
                else{

                    // checks if there is a piece, it is of the correct color, and if it can even move in the first place
                    if (pieceInCell !== null && pieceInCell.getColor()===turn && pieceInCell.listMoves().length > 0){
                        focus = pieceInCell;
                        highlightPossibleMoves(cell);
                }
                }

                //console.log(focus);
            };
        }
    }
}

//Moves a piece from old cell to new cell.
//Replace the content of newCell by those of oldCell
//Then set oldCell to an empty cell.
function movePiece(oldCell, newCell){

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

// highlights cells given an array of their locations
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