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
        if (square.getItem() == null)
            // throw exception
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
    
}

//Child Classes that inherit from the ChessPiece class.
class Pawn extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        this.firstMove = true; //A pawn can move 1-2 cells when it makes its first move
    }

    //Calculate and return the available moves for a chess piece
    listMoves(){
        let possibleMoves = [];
        let move = [];

        move = [this.location[0], this.location[1] + 1];
        if(Pawn.inBound(move)){
            possibleMoves.push(move);
        }

        if (this.firstMove){
            move = [this.location[0], this.location[1] +2];
            if(Pawn.inBound(move)){
                possibleMoves.push(move);
            }
        }
        return possibleMoves;
    }
}

class Knight extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){
        let possibleMoves = [];
        //Available Moves without any checks (for now)
        /*
            White:
                up 1, right/left 2
                down 1, right/left 2

                or

                up 2, right/left 1
                down 2, right/left 1

            Black:
                Same thing for knight. 
                As Wei suggested to add more checks, we will be 
                talking about this in tomorrow's meeting. 
        */
    }
}

class Bishop extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){}
}

class Rook extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){}
}

class King extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){}
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
        for (let i = this.location[0] + 1; i < board.length; i++){
            arr.push([i,this.location[1]]);
            if (board[i][this.location[1]].getItem() != null)
            break;
        }

        // Move Up
        for (let i = this.location[0] - 1; i >= 0; i--){
            arr.push([i,this.location[1]]);
            if (board[i][this.location[1]].getItem() != null)
            break;
        }

        // Move Right
        for (let i = this.location[1] + 1; i < board.length; i++){
            arr.push([this.location[0],i]);
            if (board[this.location[0]][i].getItem() != null)
            break;
        }
        
        // Move Left
        for (let i = this.location[1] - 1; i >= 0; i--){
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
            let square = board[arr[i][0]][arr[i][1]];
            if (square.getItem() != null && square.getItem().getColor()==this.color){
                arr.splice(i,1);
            }
        }
        return arr;
    }
}