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

    containMove(location){
        //Checks if current piece's moves contain a specific move.
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
        var thispiece = this;
        var enemypieces = this.getColor() === "white" ? blackPiecesAlive : whitePiecesAlive;
        enemypieces.forEach(function(piece){
            piece.listMoves().forEach(function(move){
                output.add(move);
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
        //This will implement hypothetical moves
        return this.possibleMoves(); //placeholder
    }
    possibleMoves(){
        var displacement;
        if (this.color == "white")
            displacement = -1;
        else
            displacement = 1;

        let possibleMoves = [];
        let move = [];
        //The moves differ when the pawn is black/white, so check for that.
        move = [this.location[0] + displacement, this.location[1]];
        if(isInBoard(move) && isEmptyAtLocation(move)){
            possibleMoves.push(move);
        }
            
        if (possibleMoves.length == 1 && isEmptyAtLocation(move)){
            if (this.firstMove){
                move = [this.location[0] + (2 * displacement), this.location[1]];
                if(isInBoard(move) && isEmptyAtLocation(move)){
                    possibleMoves.push(move);
                }
            }
        }

        // eating diagonally
        let eat1 = [this.location[0] + displacement, this.location[1] + 1];
        let eat2 = [this.location[0] + displacement, this.location[1] - 1];
        if(isInBoard(eat1) && (!isEmptyAtLocation(eat1) && !this.isSameTeamAtLocation(eat1)))
            possibleMoves.push(eat1);
        if(isInBoard(eat2) && (!isEmptyAtLocation(eat2) && !this.isSameTeamAtLocation(eat2)))
            possibleMoves.push(eat2);


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
        //This will implement hypothetical moves
        return this.possibleMoves(); //placeholder
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
       //This will implement hypothetical moves
       return this.possibleMoves(); //placeholder
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
    }
    listMoves(){
        //This will implement the hypothetical moves.
        return this.possibleMoves();//placeholder
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
        this.isChecked = false;
    }

    listMoves(){
       //Placeholder
       return this.possibleMoves();
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
        //add function for castle move

        return possibleMoves;
    }
    // Returns true if any enemy piece can eat the king (the king is in the piece's path)
    isInCheck(){
        var enemyMoves = this.allPossibleEnemyMoves(); //an array containing all possible moves that can be done by the enemy
        if (enemyMoves.has(this.getLocation())){
            this.isChecked = true;
        }
        else{
            this.isChecked = false;
        }
        return this.isChecked;
    }

    //Getter Method to check if king is checked without recomputing eneny moves.
    isChecked(){
        return this.isChecked;
    }
}

class Queen extends ChessPiece{
    constructor(location, color, type){
        super(location, color, type);
    }
    listMoves(){
      //this will implement hypothetical moves
      return this.possibleMoves();
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