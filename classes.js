/*
    Cell class represents each cell in the chess board. 
*/
class Cell{
    //location is an [x,y] point 
    //item checks if the cell holds a chess piece
    constructor(){
        this.location = null;   
        this.item = null;       
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
}

/*
    ChessPiece is a parent class that stores all common properties 
    for all chess pieces.
*/
class ChessPiece{
    //Default Properties for all chess pieces.
    contructor(){
        this.location = null;
        this.color = null;
        this.type = null;
        this.isAlive = true;
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
}

//Child Classes that inherit from the ChessPiece class.
class Pawn extends ChessPiece{
    constructor(){
        super();
        this.firstMove = true; //A pawn can move 1-2 cells when it makes its first move
    }

    //Calculate and return the available moves for a chess piece
    listMoves(){}
}

class Knight extends ChessPiece{
    constructor(){
        super();
    }
    listMoves(){}
}

class Bishop extends ChessPiece{
    constructor(){
        super();
    }
    listMoves(){}
}

class Rook extends ChessPiece{
    constructor(){
        super();
    }
    listMoves(){}
}

class King extends ChessPiece{
    constructor(){
        super();
    }
    listMoves(){}
}

class Queen extends ChessPiece{
    constructor(){
        super();
    }
    listMoves(){}
}
