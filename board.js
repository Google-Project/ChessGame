//Global Variables
board = null;

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

    //Fill in the 2D Board and create mappings to HTML <td> elements
    var cells = document.querySelectorAll('td');
    var tdCounter = 0; //Tracks the current <td> element 
    for (let r=0; r<board.length; r++){
        for (let c=0; c<board[r].length; c++){
            //Populate each element with a Cell object
            let cell = new Cell();
            cell.setLocation([r,c]);
            board[r][c] = cell;

            //Each <td> element maps to a Cell object from board.
            cells[tdCounter++].object = board[r][c];

            //TESTING PURPOSES, REMOVE WHEN NEEDED
            //console.log(cells[tdCounter - 1].object);
        }
    }
}

//I would like to discuss about this. 
function initializeModels(){
    //var cells = document.querySelectorAll('td');
    /*
    cells.forEach(element=>{
        element.piece = new Pawn();
    })
    cells.forEach(element=>{
        if (element.piece == "pawn"){
            let img = document.createElement("img");
            img.src="chess_models/chess_pieces/black-pawn.png";
            element.appendChild(img);
        }
    })
    */
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

