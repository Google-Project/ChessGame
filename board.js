/*
    Set up the board with javascript
*/
function initializeBoard(){
    //...
}

var cells = document.querySelectorAll('td');
cells.forEach(element=>{
    element.piece = "pawn";
})
cells.forEach(element=>{
    if (element.piece == "pawn"){
        let img = document.createElement("img");
        img.src="chess_models/chess_pieces/black-pawn.png";
        element.appendChild(img);
    }
})