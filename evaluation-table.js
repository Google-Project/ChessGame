//Minimax Evaluation Table
//There are multiple methods for evaluation, we will use the "Piece-Square" Method from: https://www.chessprogramming.org/Simplified_Evaluation_Function

//White Pieces
//Pawn
wPawnEv = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
]

//Knight
wKnightEv = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
]

//Bishop
wBishopEv = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
   [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
]

//Rook
wRookEv = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
   [-5,  0,  0,  0,  0,  0,  0, -5],
   [-5,  0,  0,  0,  0,  0,  0, -5],
   [-5,  0,  0,  0,  0,  0,  0, -5],
   [-5,  0,  0,  0,  0,  0,  0, -5],
   [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
]

//Queen
wQueenEv = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
]

//King middle game
wKingMidEv = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
]

//King end game evaluation
//Since there's no formal defintion for end-game, we will consider it when either side has <= 4 pieces remaining
wKingEndEv = [
    [-50,-40,-30,-20,-20,-30,-40,-50],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-30,  0,  0,  0,  0,-30,-30],
    [-50,-30,-30,-30,-30,-30,-30,-50]
]

//Black Pieces (Mirrored value of white pieces)
const rows = 8;
bPawnEv = new Array(8).fill(new Array(8));
for (let i=0; i<4; i++){
    let tmp = wPawnEv[rows-i-1];

    //Swaps
    bPawnEv[i] = tmp;
    bPawnEv[rows-i-1] = wPawnEv[i];
}

bKnightEv = new Array(8).fill(new Array(8));
for (let i=0; i<4; i++){
    let tmp = wKnightEv[rows-i-1];

    //Swaps
    bKnightEv[i] = tmp;
    bKnightEv[rows-i-1] = wKnightEv[i];
}

bBishopEv = new Array(8).fill(new Array(8));
for (let i=0; i<4; i++){
    let tmp = wBishopEv[rows-i-1];

    //Swaps
    bBishopEv[i] = tmp;
    bBishopEv[rows-i-1] = wBishopEv[i];
}

bRookEv = new Array(8).fill(new Array(8));
for (let i=0; i<4; i++){
    let tmp = wRookEv[rows-i-1];

    //Swaps
    bRookEv[i] = tmp;
    bRookEv[rows-i-1] = wRookEv[i];
}

bQueenEv = new Array(8).fill(new Array(8));
for (let i=0; i<4; i++){
    let tmp = wQueenEv[rows-i-1];

    //Swaps
    bQueenEv[i] = tmp;
    bQueenEv[rows-i-1] = wQueenEv[i];
}

bKingMidEv = new Array(8).fill(new Array(8));
for (let i=0; i<4; i++){
    let tmp = wKingMidEv[rows-i-1];

    //Swaps
    bKingMidEv[i] = tmp;
    bKingMidEv[rows-i-1] = wKingMidEv[i];
}

bKingEndEv = new Array(8).fill(new Array(8));
for (let i=0; i<4; i++){
    let tmp = wKingEndEv[rows-i-1];

    //Swaps
    bKingEndEv[i] = tmp;
    bKingEndEv[rows-i-1] = wKingEndEv[i];
}