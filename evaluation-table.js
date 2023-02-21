//Minimax Evaluation Table
//There are multiple methods for evaluation, we will use the "Piece-Square" Method from: https://www.chessprogramming.org/Simplified_Evaluation_Function

//White Pieces
//Pawn
wPawnEv = -1;

//Knight
wKnightEv = -3;

//Bishop
wBishopEv = -3;

//Rook
wRookEv = -5;

//Queen
wQueenEv = 9;

//King middle game
wKingMidEv = 0;

//Black Pieces (Mirrored value of white pieces)
const rows = 8;
bPawnEv = -1 * wPawnEv;


bKnightEv = -1 * wKnightEv;

bBishopEv = -1 * wBishopEv;

bRookEv = -1 * wRookEv;

bQueenEv = -1 * wQueenEv;

bKingMidEv = -1 * wKingMidEv;