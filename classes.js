/*
    Cell class represents each cell in the chess board. 
*/
class Cell{
    constructor(){
        this.location = null;   
        this.item = null;       
        this.element = document.createElement('td');
    }

    //Setter
    setItem(newItem){
        this.item = newItem;
    }
    setLocation(newLocation){
        this.location = newLocation;
    }

    //Getter
    getItem(){
        return this.item;
    }
    getLocation(){
        return this.location;
    }
    getElement(){
        return this.element;
    }
    isEmpty(){
        return this.getItem() == null;
    }
}

/*
    ChessPiece is a parent class that stores all common properties 
    for all chess pieces.
*/
class ChessPiece{
    //Default Properties for all chess pieces.
    constructor(location, color, type){
        this.location = location;
        this.color = color;
        this.type = type;
        this.isAlive = true;

        this.element = document.createElement('img');
        this.element.classList.add('chess-piece');
        this.element.src = 'chess_models/chess_pieces/' + color + '-' + type + '.png';
    }

    //Checks if current piece's moves contain a specific move.
    containMove(location){
        let [x1,y1] = location;
        let moves = this.listMoves();

        for (let i=0; i<moves.length; i++){
            let [x2,y2] = moves[i];
            if (x1===x2 && y1===y2){
                return true;
            }
        }

        return false;
    }

    //Tests if the hypothetical move (the location of newCell) can be selected as a valid move.
     /*
                Can either be enemy piece or empty cell:
                In both cases, we can assume that the new cell "doesn't" contain a piece (if it does we will restore that piece later) 
                and allow the current piece to "move" to the new cell. Note that if the new cell does contain a piece (which can be eaten hypothetically),
                that piece will have isAlive=false to avoid conflicts when generating opponent pieces' possibleMoves. Its original state, as mentioned, will be
                restored later.

                The piece in its original cell will "move" to the new cell, then we can do check/checkmate tests 
                based on the hypothetical conditions. If our king is not checked, add this move as an available move, otherwise no.
                Finally, restore both the old and new cells to what they were before. 

                Example:    
                Stage 1, Given this state:
                //X X (BP or X) X
                //BR X WR WK

                Stage 2, WR tries to move up one row (Hypothetical Move): Note that we need to preserve the state
                of the piece (if any) in the new cell.
                //X X WR X 
                //BR X X WK (here the black rook (BR) can check the king, so don't add this to availableMoves)
                Do the check() from enemy pieces. If checked, don't add move to availableMoves, if not then add it.
                
                Stage 3, Restore the pieces to their original cells:
                //X X (BP or X) X
                //BR X WR WK

                We repeat this cycle for all hypothetical moves. 
                Since each chess piece (except the King which has special cases)'s hypothetical move mechanism is the same,
                we can include a common method shared by those chess piece in the ChessPiece class. 
                In this case, it would be the canAddHyptMove() method. 
    */
    canAddHyptMove(oldCell, newCell){
        var pieceAtOldCell = oldCell.getItem(); //This is guaranteed to contain a piece
        var [x,y] = oldCell.getLocation();

        var pieceAtNewCell = newCell.getItem(); //This can be an empty piece (null) or a piece
        var [x2,y2] = newCell.getLocation();

        var enPassant = false; //Sees if enPassant happened
        var displacement = turn === 'white' ? 1 : -1; //For enPassant checks
        var captureCell = null;
        var capturePiece = null //For enPassant checks

        var canAddMove = false;
        //Stage 1
        newCell.setItem(pieceAtOldCell); //We assume the new cell doesn't have a piece 
        pieceAtOldCell.setLocation([x2,y2]); //to be consistent with the location of the current piece
        oldCell.setItem(null); //The old cell becomes empty after the hypothetical move
        if (pieceAtNewCell !== null){
            pieceAtNewCell.setIsAlive(false);
        }
        else{
            //En Passant Special Case
            if (pieceAtOldCell.getType() === 'pawn'){
                let [x3,y3] = [x2, y2+displacement];
                if (isInBoard([x3,y3]) && !isEmptyAtLocation([x3,y3])){
                    captureCell = board[x3][y3];
                    if(!pieceAtOldCell.isSameTeamAtLocation([x3,y3]) && captureCell.getItem().getType() === 'pawn'){
                        enPassant = true;
                        //Get the position of the enemy pawn that can be eaten
                        capturePiece = captureCell.getItem();
                        capturePiece.setIsAlive(false);
                        captureCell.setItem(null);
                    }
                }
            }
        }
        //Stage 2
        if (turn === 'white'){
            if (!whiteKing.isInCheck()){
                canAddMove = true;
            }
        }
        else{
            if (!blackKing.isInCheck()){
                canAddMove = true;
            }
        }

        //Stage 3
        //if there was a piece at the new cell, we will restore it after checking for a check in the old cell
        //Also restore the original piece's location
        oldCell.setItem(pieceAtOldCell);
        pieceAtOldCell.setLocation([x,y]);
        newCell.setItem(pieceAtNewCell);
        if (pieceAtNewCell !== null){
            pieceAtNewCell.setIsAlive(true);
        }
        if (enPassant){
            capturePiece.setIsAlive(true);
            captureCell.setItem(capturePiece);
        }
        return canAddMove;
    }

    //Setter
    setLocation(newLocation){
        this.location = newLocation;
    }
    setColor(newColor){
        this.color = newColor;
    }
    setType(newType){
        this.type = newType;
    }
    setIsAlive(state){
        this.isAlive = state;
    }

    //Getter
    getLocation(){
        return this.location;
    }
    getColor(){
        return this.color;
    }
    getType(){
        return this.type;
    }
    getIsAlive(){
        return this.isAlive;
    }
    getElement(){
        return this.element;
    }

    // Returns true if the piece at the location is in the same team
    isSameTeamAtLocation(location){
        let square = board[location[0]][location[1]];
        if (square.getItem() == null){
            // throw exception
        }
        else if (square.getItem().getColor()==this.color){
            return true;
        }
        return false;
    }

    //function to check if pieces go out of bounds
    inBound(arr){
        if (arr[0] < 0 || 
            arr[0] > 7 || 
            arr[1] < 0 || 
            arr[1] > 7){
                return false;
        }
        return true;
    }

    //This is used to check for checkmate/stalemate after a player moves a piece and then it's the other player's turn.
    //returns true if at least one same-color piece can move, otherwise false (checkmate/stalemate)
    sameColorPiecesCanMove(){
        var piecesAlive = turn === 'white' ? whitePiecesAlive : blackPiecesAlive;
        var hasAvailableMoves = false;
        for (let i=0; i<piecesAlive.length; i++){
            let piece = piecesAlive[i];
            if (piece.listMoves().length > 0){
                hasAvailableMoves = true;
                break;
            }
        }
        return hasAvailableMoves;
    }

    //This is used when a player clicks on a piece and wants to move it. 
    // returns all possible moves that the enemy can take
    // Output: An object accessable by object[x][y] ([x][y] is a location), containing unique moves only
    allPossibleEnemyMoves(){
        var output = {};
        var enemypieces = this.getColor() === "white" ? blackPiecesAlive : whitePiecesAlive;
        enemypieces.forEach(function(piece){
            //Checks if a piece is alive (used in Hypothetical Moves)
            if (piece.getIsAlive()){
                piece.possibleMoves().forEach(function(move){
                    let [x,y] = move;
                    //If the current x is not defined
                    if (!output[x]){
                        output[x] = {};
                    }
                    //If the current y is not defined
                    if (!output[x][y]){
                        output[x][y] = true;
                    }
                });
            }
        });

        //console.log(output);
        return output;
    }
    
}

//Child Classes that inherit from the ChessPiece class.
class Pawn extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        this.firstMove = true; //A pawn can move 1-2 cells when it makes its first move
        this.displacementOfTwo = false; //This tracks if the the pawn moved forward 2 cells.
    }

    //Calculate and return the available moves for a chess piece
    listMoves(){
        var availableMoves = [];
        var [x,y] = this.getLocation();
        //Checks which of the possible moves can be selected in case of a check.
 
        var possibleMoves = this.possibleMoves();
        for (let i=0; i<possibleMoves.length; i++){
             let hyptMove = possibleMoves[i];
             let x2 = hyptMove[0], y2 = hyptMove[1];
             if (super.canAddHyptMove(board[x][y], board[x2][y2])){
                availableMoves.push(hyptMove);
             }
        };
        return availableMoves;
    }
    possibleMoves(){
        var displacement;
        var [x,y] = this.getLocation();
        if (this.color == "white")
            displacement = -1;
        else
            displacement = 1;

        let possibleMoves = [];
        let move = [];
        //The moves differ when the pawn is black/white, so check for that.
        move = [x + displacement, y];
        if(isInBoard(move) && isEmptyAtLocation(move)){
            possibleMoves.push(move);
        }
            
        if (possibleMoves.length == 1 && isEmptyAtLocation(move)){
            if (this.firstMove){
                move = [x + (2 * displacement), y];
                if(isInBoard(move) && isEmptyAtLocation(move)){
                    possibleMoves.push(move);
                }
            }
        }

        // eating diagonally
        let eat1 = [x + displacement, y + 1];
        let eat2 = [x + displacement, y - 1];
        if(isInBoard(eat1) && (!isEmptyAtLocation(eat1) && !this.isSameTeamAtLocation(eat1)))
            possibleMoves.push(eat1);
        if(isInBoard(eat2) && (!isEmptyAtLocation(eat2) && !this.isSameTeamAtLocation(eat2)))
            possibleMoves.push(eat2);


        /*
            En Passant
        */
        let eat3 = [x, y - 1];  //Checks for adjacent left pawn, if any
        let eat4 = [x, y + 1];  //Checks for adjacent right pawn, if any
        if(isInBoard(eat3) && !isEmptyAtLocation(eat3) && !this.isSameTeamAtLocation(eat3)){
            //Checks left adjacent piece is a pawn
            let piece = board[eat3[0]][eat3[1]].getItem();
            if (piece.getType() === 'pawn' && piece.displacementOfTwo){
                console.log('en passant considered');
                //The pawn will, however, eat diagonally, so this is a special case in hypothetical moves
                if (isInBoard([x + displacement, y - 1]) && isEmptyAtLocation([x + displacement, y - 1])){
                    console.log('en passant added');
                    possibleMoves.push([x + displacement, y - 1]);
                }
            }
        }
        
        if(isInBoard(eat4) && !isEmptyAtLocation(eat4) && !this.isSameTeamAtLocation(eat4)){
            //Checks right adjacent piece is a pawn
            let piece = board[eat4[0]][eat4[1]].getItem();
            if (piece.getType() === 'pawn' && piece.displacementOfTwo){
                //The pawn will, however, eat diagonally, so this is a special case in hypothetical moves
                if (isInBoard([x + displacement, y + 1]) && isEmptyAtLocation([x + displacement, y + 1])){
                    possibleMoves.push([x + displacement, y + 1]);
                }
            }
        }

        //if pawn is on the other side, give option to change pawn's type
        return possibleMoves;
    }
}

class Knight extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){
        var availableMoves = [];
        var [x,y] = this.getLocation();
        //Checks which of the possible moves can be selected in case of a check.
 
        var possibleMoves = this.possibleMoves();
        for (let i=0; i<possibleMoves.length; i++){
             let hyptMove = possibleMoves[i];
             let x2 = hyptMove[0], y2 = hyptMove[1];
             if (super.canAddHyptMove(board[x][y], board[x2][y2])){
                availableMoves.push(hyptMove);
             }
        };
        return availableMoves;
    }
    possibleMoves(){
        //Possible moves the knight can take.
        let possibleMoves = [];
        
        //Move set (the paths it CAN take)
        let moveSet = [
            [this.location[0] - 1, this.location[1] - 2], [this.location[0] - 2, this.location[1] - 1],
            [this.location[0] + 1, this.location[1] - 2], [this.location[0] + 2, this.location[1] - 1],
            [this.location[0] - 2, this.location[1] + 1], [this.location[0] - 1, this.location[1] + 2],
            [this.location[0] + 2, this.location[1] + 1], [this.location[0] + 1, this.location[1] + 2]
        ];

        //Check if any moves in the moveSet can be added to possibleMoves
        for (let i=0; i<moveSet.length; i++){
            let move = moveSet[i];
            if (isInBoard(move)){
                if (isEmptyAtLocation(move) || !this.isSameTeamAtLocation(move)){
                    possibleMoves.push(move);
                }
            }
        }
      
        return possibleMoves;
    }
}

class Bishop extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        
    }
    listMoves(){
       var availableMoves = [];
       var [x,y] = this.getLocation();
       //Checks which of the possible moves can be selected in case of a check.

       var possibleMoves = this.possibleMoves();
       for (let i=0; i<possibleMoves.length; i++){
            let hyptMove = possibleMoves[i];
            let x2 = hyptMove[0], y2 = hyptMove[1];
            if (super.canAddHyptMove(board[x][y], board[x2][y2])){
                availableMoves.push(hyptMove);
            }
       };

       return availableMoves;
    }
    possibleMoves(){
        var arr = [];

        // Move Diagonally Down Right
        for (let i = 1; isInBoard([this.location[0] + i,this.location[1] + i]); i++){
            arr.push([this.location[0] + i, this.location[1] + i]);
            if (!isEmptyAtLocation([this.location[0] + i,this.location[1] + i])){
                break;
            }
        }

        // Move Diagonally Down Left
        for (let i = 1; isInBoard([this.location[0] + i,this.location[1] - i]); i++){
            arr.push([this.location[0] + i, this.location[1] - i]);
            if (!isEmptyAtLocation([this.location[0] + i,this.location[1] - i])){
                break;
            }
        }

        // Move Diagonally Up Right
        for (let i = 1; isInBoard([this.location[0] - i,this.location[1] + i]); i++){
            arr.push([this.location[0] - i, this.location[1] + i]);
            if (!isEmptyAtLocation([this.location[0] - i,this.location[1] + i])){
                break;
            }
        }

        // Move Diagonally Up Left
        for (let i = 1; isInBoard([this.location[0] - i,this.location[1] - i]); i++){
            arr.push([this.location[0] - i, this.location[1] - i]);
            if (!isEmptyAtLocation([this.location[0] - i,this.location[1] - i])){
                break;
            }
        }         
        
        // Remove squares with pieces of the same color
        for (let i = arr.length - 1; i >= 0; i--){
            if (!isEmptyAtLocation(arr[i]) && this.isSameTeamAtLocation(arr[i])){
                arr.splice(i,1);
            }
        }
        return arr;
    }
}

class Rook extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        this.firstMove = true; //For Castling
    }
    listMoves(){
        var availableMoves = [];
        var [x,y] = this.getLocation();
        //Checks which of the possible moves can be selected in case of a check.
 
        var possibleMoves = this.possibleMoves();
        for (let i=0; i<possibleMoves.length; i++){
             let hyptMove = possibleMoves[i];
             let x2 = hyptMove[0], y2 = hyptMove[1];
             if (super.canAddHyptMove(board[x][y], board[x2][y2])){
                availableMoves.push(hyptMove);
             }
        };
        return availableMoves;
    }
    possibleMoves(){
        var arr = [];

        // Gets all possible Move locations and stops moving at the first chess piece (including white and black) 
        // Move Down
        for (let i = this.location[0] + 1; isInBoard([i,this.location[1]]); i++){
            arr.push([i,this.location[1]]);
            if (board[i][this.location[1]].getItem() != null)
            break;
        }

        // Move Up
        for (let i = this.location[0] - 1;isInBoard([i,this.location[1]]); i--){
            arr.push([i,this.location[1]]);
            if (board[i][this.location[1]].getItem() != null)
            break;
        }

        // Move Right
        for (let i = this.location[1] + 1; isInBoard([this.location[0],i]); i++){
            arr.push([this.location[0],i]);
            if (board[this.location[0]][i].getItem() != null)
            break;
        }
        
        // Move Left
        for (let i = this.location[1] - 1;isInBoard([this.location[0],i]); i--){
            arr.push([this.location[0],i]);
            if (board[this.location[0]][i].getItem() != null)
            break;
        }

        // Remove squares with pieces of the same color
        for (let i = arr.length - 1; i >= 0; i--){
            if (!isEmptyAtLocation(arr[i]) && this.isSameTeamAtLocation(arr[i])){
                arr.splice(i,1);
            }
        }
        return arr;
    }
}

class King extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        this.firstMove = true; //For Castling
    }

    listMoves(){
        var availableMoves = [];
        var [x,y] = this.getLocation();
        //Checks which of the possible moves can be selected in case of a check.
        var possibleMoves = this.possibleMoves();
        for (let i=0; i<possibleMoves.length; i++){
             let hyptMove = possibleMoves[i];
             let x2 = hyptMove[0], y2 = hyptMove[1];
             if (super.canAddHyptMove(board[x][y], board[x2][y2])){
                availableMoves.push(hyptMove);
             }
        };

        return availableMoves;
    }
    possibleMoves(){
        let possibleMoves = [];

        //Available Moves without any checks (for now)
        //move down, but missing check for border
        possibleMoves.push([this.location[0] - 1, this.location[1] - 1]);
        possibleMoves.push([this.location[0], this.location[1] - 1]);
        possibleMoves.push([this.location[0] + 1, this.location[1] - 1]);
        //sideways
        possibleMoves.push([this.location[0] - 1, this.location[1]]);
        possibleMoves.push([this.location[0] + 1, this.location[1]]);
        //up
        possibleMoves.push([this.location[0] - 1, this.location[1] + 1]);
        possibleMoves.push([this.location[0], this.location[1] + 1]);
        possibleMoves.push([this.location[0] + 1, this.location[1] + 1]);

        // Remove squares with pieces of the same color
        for (let i = possibleMoves.length - 1; i >= 0; i--){
            if (!isInBoard(possibleMoves[i]) || (!isEmptyAtLocation(possibleMoves[i]) && this.isSameTeamAtLocation(possibleMoves[i]))){
                possibleMoves.splice(i,1);
            }
        }

        //Checks if castling is available
        /*
            Castling requires 2 consecutive empty cells to the right or 3 to the left to be empty
            and both the king and rook have not been moved yet. This means the king and 
            the rook must be at the default starting locations (unlike in Pawn Promotion where pawn becomes rook)
            Also, the king must not be in check in the MIDDLE of castling. This is very important.

            Note that castling requires clicking the king then to the empty cell, not clicking on the rook to the empty cell.
        */
            var thisPiece = turn === 'white' ? whiteKing : blackKing;
            //If the king has not moved
            if (thisPiece.firstMove){
                var [x, y] = this.getLocation();
                var displacement = 1;
                //Check if king can move to right side for castling
                for (displacement; displacement<=3; displacement++){
                    let [x2, y2] = [x, y+displacement];

                    //If the location is invalid
                    if (!isInBoard([x2, y2])) break;

                    //Possible right rook at default location
                    if (displacement === 3){
                        let pieceAtNewCell = board[x2][y2].getItem();
                        //If right rook exists, in the same team as king, and hasn't moved, then we have a castling move 
                        //(we already checked the cells in between the king and the rook in the 'else' statement below)
                        if (this.isSameTeamAtLocation([x2, y2]) && pieceAtNewCell.getType() === 'rook' && pieceAtNewCell.firstMove){
                            possibleMoves.push([x2, y2-1]);
                        }
                    }
                    //Check for empty cells in between
                    else{
                        //If the cell is not empty or the cell is empty and the king gets checked there hypothetically, then no castling
                        if (!isEmptyAtLocation([x2, y2]) || (isEmptyAtLocation[x2, y2] && !this.canAddHyptMove([x2, y2]))) break;
                    }
                } 

                //reset displacement
                displacement = 1;

                //Check if king can move to left side for castling. 
                for (displacement; displacement<=4; displacement++){
                    let [x2, y2] = [x, y-displacement];

                    //If the location is invalid
                    if (!isInBoard([x2, y2])) break;

                    //Possible left rook at default location
                    if (displacement === 4){
                        let pieceAtNewCell = board[x2][y2].getItem();;
                        //If left rook exists, in the same team as king, and hasn't moved, then we have a castling move 
                        //(we already checked the cells in between the king and the rook in the 'else' statement below)
                        if (this.isSameTeamAtLocation([x2, y2]) && pieceAtNewCell.getType() === 'rook' && pieceAtNewCell.firstMove){
                            possibleMoves.push([x2, y2+2]);
                        }
                    }
                    //The cell next to the rook just need to be empty, no hypothetical checks needed because 
                    //after castling, the king won't land on or pass that cell.
                    else if (displacement === 3){
                        if (!isEmptyAtLocation([x2, y2])) break;
                    }
                    //Check for empty cells in between
                    else{
                        //If the cell is not empty or the cell is empty and the king gets checked there hypothetically, then no castling
                        if (!isEmptyAtLocation([x2, y2]) || (isEmptyAtLocation[x2, y2] && !this.canAddHyptMove([x2, y2]))) break;
                    }
                } 
            }        
        return possibleMoves;
    }
    // Returns true if any enemy piece can eat the king (the king is in the piece's path)
    isInCheck(){
        var enemyMoves = this.allPossibleEnemyMoves(); //an array containing all possible moves that can be done by the enemy
        var [x,y] = this.getLocation();
        //If an enemy move does not match perfectly the location of the king, then it is not checked
        if (!enemyMoves[x] || !enemyMoves[x][y]){
            return false;
        }
        else{
            return true;
        }
    }

    //Check if enemy king is checkmated after a player has moved a piece and switched turn.
    isCheckmated(){
        if (this.isInCheck() && !super.sameColorPiecesCanMove()){
            return true;
        }
        else{
            return false;
        }
    }

    //Checks if the king is stalemated (don't have any legal moves but the king itself is not checked) 
    isStaleMated(){
        //If the current player cannot move at least one piece and the same-color king is not checked, then it is a stalemate
        if (!this.isInCheck() && !super.sameColorPiecesCanMove()){
            return true;
        }
        else{
            return false;
        }
    }
}

class Queen extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){
        var availableMoves = [];
        var [x,y] = this.getLocation();
        //Checks which of the possible moves can be selected in case of a check.
 
        var possibleMoves = this.possibleMoves();
        for (let i=0; i<possibleMoves.length; i++){
             let hyptMove = possibleMoves[i];
             let x2 = hyptMove[0], y2 = hyptMove[1];
             if (super.canAddHyptMove(board[x][y], board[x2][y2])){
                availableMoves.push(hyptMove);
             }
        };
        return availableMoves;
    }
    possibleMoves(){
          // Contains all possible move locations
          var arr = [];

          // Gets all possible Move locations and stops moving at the first chess piece (including white and black) 
  
          // Move Down
          for (let i = this.location[0] + 1; isInBoard([i, this.location[1]]); i++){
              arr.push([i,this.location[1]]);
              if (board[i][this.location[1]].getItem() != null)
              break;
          }
  
          // Move Up
          for (let i = this.location[0] - 1; isInBoard([i, this.location[1]]); i--){
              arr.push([i,this.location[1]]);
              if (board[i][this.location[1]].getItem() != null)
              break;
          }
  
          // Move Right
          for (let i = this.location[1] + 1; isInBoard([this.location[0],i]); i++){
              arr.push([this.location[0],i]);
              if (board[this.location[0]][i].getItem() != null)
              break;
          }
          
          // Move Left
          for (let i = this.location[1] - 1; isInBoard([this.location[0],i]); i--){
              arr.push([this.location[0],i]);
              if (board[this.location[0]][i].getItem() != null)
              break;
          }
  
          // Move Diagonally Down Right
          for (let i = 1; isInBoard([this.location[0] + i,this.location[1] + i]); i++){
              arr.push([this.location[0] + i, this.location[1] + i]);
              if (board[this.location[0] + i][this.location[1] + i].getItem() != null){
                  break;
              }
          }
  
          // Move Diagonally Down Left
          for (let i = 1; isInBoard([this.location[0] + i,this.location[1] - i]); i++){
              arr.push([this.location[0] + i, this.location[1] - i]);
              if (board[this.location[0] + i][this.location[1] - i].getItem() != null){
                  break;
              }
          }
  
          // Move Diagonally Up Right
          for (let i = 1; isInBoard([this.location[0] - i,this.location[1] + i]); i++){
              arr.push([this.location[0] - i, this.location[1] + i]);
              if (board[this.location[0] - i][this.location[1] + i].getItem() != null){
                  break;
              }
          }
  
          // Move Diagonally Up Left
          for (let i = 1; isInBoard([this.location[0] - i,this.location[1] - i]); i++){
              arr.push([this.location[0] - i, this.location[1] - i]);
              if (board[this.location[0] - i][this.location[1] - i].getItem() != null){
                  break;
              }
          }
  
          // Remove squares with pieces of the same color
          for (let i = arr.length - 1; i >= 0; i--){
              if (!isEmptyAtLocation(arr[i]) && this.isSameTeamAtLocation(arr[i])){
                  arr.splice(i,1);
              }
          }
          return arr;
    }
}