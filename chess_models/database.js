chessBoardData = [
	{
		occupant: "blackRook_1",
		image: 'url("images/black-rook.png")',
		row: 1,
		column: 1,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackKnight_1",
		image: 'url("images/black-knight.png")',
		row: 1,
		column: 2,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackBishop_1",
		image: 'url("images/black-bishop.png")',
		row: 1,
		column: 3,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackQueen",
		image: 'url("images/black-queen.png")',
		row: 1,
		column: 4,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackKing",
		image: 'url("images/black-king.png")',
		row: 1,
		column: 5,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackBishop_2",
		image: 'url("images/black-bishop.png")',
		row: 1,
		column: 6,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackKnight_2",
		image: 'url("images/black-knight.png")',
		row: 1,
		column: 7,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackRook_2",
		image: 'url("images/black-rook.png")',
		row: 1,
		column: 8,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_1",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 1,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_2",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 2,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_3",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 3,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_4",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 4,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_5",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 5,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_6",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 6,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_7",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 7,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "blackPawn_8",
		image: 'url("images/black-pawn.png")',
		row: 2,
		column: 8,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_1",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 1,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_2",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 2,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_3",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 3,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_4",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 4,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_5",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 5,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_6",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 6,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_7",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 7,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whitePawn_8",
		image: 'url("images/white-pawn.png")',
		row: 7,
		column: 8,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteRook_1",
		image: 'url("images/white-rook.png")',
		row: 8,
		column: 1,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteKnight_1",
		image: 'url("images/white-knight.png")',
		row: 8,
		column: 2,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteBishop_1",
		image: 'url("images/white-bishop.png")',
		row: 8,
		column: 3,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteQueen",
		image: 'url("images/white-queen.png")',
		row: 8,
		column: 4,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteKing",
		image: 'url("images/white-king.png")',
		row: 8,
		column: 5,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteBishop_2",
		image: 'url("images/white-bishop.png")',
		row: 8,
		column: 6,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteKnight_2",
		image: 'url("images/white-knight.png")',
		row: 8,
		column: 7,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	},
	{
		occupant: "whiteRook_2",
		image: 'url("images/white-rook.png")',
		row: 8,
		column: 8,
		cell: function() {return (((this.row - 1) * 8) + this.column);},
		alive: true
	}
];