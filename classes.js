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
    
}

//Child Classes that inherit from the ChessPiece class.
class Pawn extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
        this.firstMove = true; //A pawn can move 1-2 cells when it makes its first move
    }

    //Calculate and return the available moves for a chess piece
    listMoves(){}
}

class Knight extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){}
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
    listMoves(){}
}

// Checks if the location is within the bounds of the board
function isInBoard(location){
    let a = location[0];
    let b = location[1];
    if (a >= 0 && a < board.length)
        if (b >= 0 && b < board.length)
            return true;
    return false;
}