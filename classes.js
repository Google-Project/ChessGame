/*
    Cell class represents each cell in the chess board. 
*/
class Cell{
    //location is an [x,y] point 
    //item checks if the cell holds a chess piece
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
        if (square.getItem().getColor()==this.color){
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

    // returns all possible moves that the enemy can take
    // Output: Set, so there are no duplicates
    allPossibleEnemyMoves(){
        var output = new Set();
        board.forEach(function(element){
            element.forEach(function(cell){
                if (!cell.isEmpty() && !isSameTeamAtLocation(cell.getLocation())){
                    cell.getItem().listMoves().forEach(function(move){
                        output.add(move);
                    });
                }
            });
        });
        return output;
    }
    
}

//Child Classes that inherit from the ChessPiece class.
class Pawn extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        this.firstMove = true; //A pawn can move 1-2 cells when it makes its first move
    }

    //Calculate and return the available moves for a chess piece
    listMoves(){
        var displacement;
        if (this.color == "white")
            displacement = -1;
        else
            displacement = 1;

        let possibleMoves = [];
        let move = [];
        //The moves differ when the pawn is black/white, so check for that.
        move = [this.location[0] + displacement, this.location[1]];
        if(isInBoard(move) && (isEmpty(move) || !this.isSameTeamAtLocation(move))){
            possibleMoves.push(move);
        }
            
        if (possibleMoves.length == 1 && isEmpty(move)){
            if (this.firstMove){
                move = [this.location[0] + (2 * displacement), this.location[1]];
                if(isInBoard(move) && (isEmpty(move) || !this.isSameTeamAtLocation(move))){
                    possibleMoves.push(move);
                }
                //turn off firstMove
                this.firstMove = false;
            }
        }
        //function to detect enemy and eat
        //also remember en pessant 
        //if pawn is on the other side, give option to change pawn's type

        return possibleMoves;
    }
}

class Knight extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){
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
        moveSet.forEach(move => {
            if (isInBoard(move)){
                if (isEmpty(move) || !this.isSameTeamAtLocation(move)){
                    possibleMoves.push(move);
                }
            }
            /*
                In order to make a valid move, we must check for the followings:
                1. The new location is empty (no chess piece is there).
                2. The new location contains chess piece with the opposite color (to be eaten)
                3. Our king is not checked. If our king is checked, then either our king must move
                   or there is at least one piece of the same color that can 'block' the king to stop
                   a check. 
                4. The new location is not out of bounds.
                5. If we decide to take the new move, our king should not be checked. This can happen
                   if the current piece is already blocking a check. 

                Idea to do checks:
                1. Once a chess piece has moved, we will mark the ranges it covers as 'protected'.
                If the range includes a piece of an opposing color, that piece will be marked 'threatened'.

                Also, once a piece is decided to move to a new cell, reset the 'protected/threatened' cells/pieces
                before moving to the new cell, in which we will have new 'protected' and 'threatened' pieces.

                This will be discussed in our next meeting. 
            */
            

        });


       return possibleMoves;
    }
}

class Bishop extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        
    }
    listMoves(){
        var arr = [];

        // Move Diagonally Down Right
        for (let i = 1; isInBoard([this.location[0] + i,this.location[1] + i]); i++){
            arr.push([this.location[0] + i, this.location[1] + i]);
            if (!isEmpty([this.location[0] + i,this.location[1] + i])){
                break;
            }
        }

        // Move Diagonally Down Left
        for (let i = 1; isInBoard([this.location[0] + i,this.location[1] - i]); i++){
            arr.push([this.location[0] + i, this.location[1] - i]);
            if (!isEmpty([this.location[0] + i,this.location[1] - i])){
                break;
            }
        }

        // Move Diagonally Up Right
        for (let i = 1; isInBoard([this.location[0] - i,this.location[1] + i]); i++){
            arr.push([this.location[0] - i, this.location[1] + i]);
            if (!isEmpty([this.location[0] - i,this.location[1] + i])){
                break;
            }
        }

        // Move Diagonally Up Left
        for (let i = 1; isInBoard([this.location[0] - i,this.location[1] - i]); i++){
            arr.push([this.location[0] - i, this.location[1] - i]);
            if (!isEmpty([this.location[0] - i,this.location[1] - i])){
                break;
            }
        }         
        
        // Remove squares with pieces of the same color
        for (let i = arr.length - 1; i >= 0; i--){
            if (!isEmpty(arr[i]) && this.isSameTeamAtLocation(arr[i])){
                arr.splice(i,1);
            }
        }
        return arr;
    }
}

class Rook extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){
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
            if (!isEmpty(arr[i]) && this.isSameTeamAtLocation(arr[i])){
                arr.splice(i,1);
            }
        }
        return arr;
    }
}

class King extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }

    listMoves(){
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
            if (!isEmpty(possibleMoves[i]) && this.isSameTeamAtLocation(possibleMoves[i])){
                possibleMoves.splice(i,1);
            }
        }
        //add function for castle move

        return possibleMoves;
    }

    isInCheck(){
        var enemyMoves = this.allPossibleEnemyMoves(); //an array containing all possible moves that can be done by the enemy
        return enemyMoves.has(this.getLocation());
    }
}

class Queen extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){
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
            if (!isEmpty(arr[i]) && this.isSameTeamAtLocation(arr[i])){
                arr.splice(i,1);
            }
        }
        return arr;
    }
}