/*
    Set up the board with javascript
*/
function initializeBoard(){
    //...
}

//TIMER
var sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }
setInterval( function(){
    document.getElementById("seconds").innerHTML=pad(++sec%60);
    document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
}, 1000);


var cells = document.querySelectorAll('td');
cells.forEach(element=>{
    element.piece = Pawn()
})
cells.forEach(element=>{
    if (element.piece == "pawn"){
        let img = document.createElement("img");
        img.src="chess_models/chess_pieces/black-pawn.png";
        element.appendChild(img);
    }
})

