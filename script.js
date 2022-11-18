var board = new Array(8);

let selectedPiece = null;
let ctx = null;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function setUpMouseEvent() {
    canvas = document.getElementById("board");
    canvas.addEventListener("click", function (evt) {
        handleMouse(getMousePos(canvas, evt));
    }, false);
}

window.onload = function() {
    setUpPieces();
    drawBoard();
    setUpMouseEvent();
};


function norm(num) {
    return (Math.floor(num/75));
}

function handleMouse(mousePos) {
    var x = norm(mousePos.x);
    var y = norm(mousePos.y);
    console.log("X: " + x + " Y: " + y);
    if(selectedPiece == null) {
        selectedPiece = board[x][y];
        console.log(selectedPiece);
    }
    else {
        console.log(selectedPiece.type);
        if(canMove(selectedPiece,x,y)) {
            selectedPiece.move(x,y);
        }
        else {
            console.log("invalid move");
            console.log(selectedPiece.getValidMoves());
        }
        selectedPiece = null;
    }
    drawBoard();
}

function setUpPieces() {
    for (var i = 0; i < 8; i++) {
        board[i] = new Array(8);
        for(var j = 0; j < 8; j++) {
            board[i][j] = null;
        }
    }

    addSymmetrical("rook",0,0);
    addSymmetrical("rook",7,0);
    addSymmetrical("knight",1,0);
    addSymmetrical("knight",6,0);
    addSymmetrical("bishop",2,0);
    addSymmetrical("bishop",5,0);
    addSymmetrical("queen",3,0);
    addSymmetrical("king",4,0);
    for(i =0; i < 8; i++) { addSymmetrical("pawn", i,1); }
}

function addSymmetrical(type, x, y) {
    board[x][y]   = new Piece("black", type,x,y);
    board[x][7-y] = new Piece("white", type,x,7-y);
}

function drawBoard() {
    c = document.getElementById('board');
    ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, 800, 800);
    ctx.fillStyle = "white";
    ctx.fill();
    for (i = 0; i <8; i++) {
        drawLine(i);
    }
    for(y=0;y<8;y++) for(x=0;x<8;x++) if(board[x][y] != null) board[x][y].draw();
    drawValidMoves(selectedPiece);
}

function drawLine(y) {
    start = (y%2 == 0)? 1 : 0;
    for (;start < 8; start+=2) {
        drawSquare(start,y, "black");
    }
}

function drawSquare(x, y, colour) {
    ctx.beginPath();
    ctx.rect(x*75, y*75, 75, 75);
    ctx.fillStyle = colour;
    ctx.fill();
}

function canMove(piece, x, y) {
    validMoves = piece.getValidMoves();
    for(i =0; i < validMoves.length; i++ ){
        if(validMoves[i].x == x && validMoves[i].y == y) return true;
    }
    return false;
}

function pushIfValid(piece, array, position) {
    keepGoing = true;
    if(position.x < 0 || position.y < 0 || position.x > 7 || position.y > 7) return true;
    if(board[position.x][position.y] != null) {
        if(board[position.x][position.y].team == piece.team) return false;
        else keepGoing=false;
    }
    array.push(position);
    return keepGoing;
}

function drawValidMoves(piece) {
    if(piece == null) return;
    validMoves = piece.getValidMoves();
    if(validMoves == null || validMoves.length < 1) return;
    validMoves.forEach(element => {
        drawSquare(element.x,element.y,"green");
    });
}

function pawnMoves(piece) {
    // TODO: make pawn only take diagonly (like / or \)
    validMoves = new Array();
    if(!piece.hasMoved) { pushIfValid(piece, validMoves, ( (piece.team == "black")? {x: piece.x, y: piece.y+2} : {x: piece.x, y: piece.y-2})); } 
    pushIfValid(piece, validMoves, ( (piece.team == "black")? {x: piece.x, y: piece.y+1} : {x: piece.x, y: piece.y-1}));
    return validMoves;
} 
function rookMoves(piece) {
    validMoves = new Array();
    up = true;
    down = true;
    left = true;
    right = true;
    for(i = 1; i < 8; i++) {
        if(left)  { left  = pushIfValid(piece, validMoves,{x: piece.x-i, y: piece.y}); }
        if(right) { right = pushIfValid(piece, validMoves,{x: piece.x+i, y: piece.y}); }
        if(up)    { up    = pushIfValid(piece, validMoves,{x: piece.x, y: piece.y-i}); }
        if(down)  { down  = pushIfValid(piece, validMoves,{x: piece.x, y: piece.y+i}); }
    }
    return validMoves;
}
function bishopMoves(piece) {
    // TODO: fix bishop movemnt to new system 
    validMoves = new Array();
    for(i = -7; i < 8; i++) {
        if(i == 0 ) continue;
        pushIfValid(piece, validMoves, {x: piece.x + i, y: piece.y + i})
        pushIfValid(piece, validMoves, {x: piece.x - i, y: piece.y + i})
    }
    return validMoves;
}
function knightMoves(piece) {
    // TODO: Find better way of checking valid moves for the knight! 
    validMoves = new Array();
    pushIfValid(piece, validMoves, {x: piece.x-1, y: piece.y - 2});
    pushIfValid(piece, validMoves, {x: piece.x+1, y: piece.y - 2});
    pushIfValid(piece, validMoves, {x: piece.x-1, y: piece.y + 2});
    pushIfValid(piece, validMoves, {x: piece.x+1, y: piece.y + 2});
    pushIfValid(piece, validMoves, {x: piece.x-2, y: piece.y - 1});
    pushIfValid(piece, validMoves, {x: piece.x+2, y: piece.y - 1});
    pushIfValid(piece, validMoves, {x: piece.x-2, y: piece.y + 1});
    pushIfValid(piece, validMoves, {x: piece.x+2, y: piece.y + 1});
    return validMoves;
}
function kingMoves(piece) {
    validMoves = new Array();
    for(i = -1; i < 2; i++) {
        for(j = -1; j < 2; j++) {
            if(i == 0 && j == 0) { continue; }
            pushIfValid(piece, validMoves,{x: piece.x + i, y: piece.y + j});
        }
    } 
    return validMoves;
}
function queenMoves(piece) {
    return rookMoves(piece).concat(bishopMoves(piece));
}

class Piece {
    constructor(team, type, x, y) {
        this.team = team;
        this.type = type;
        this.x = x;
        this.y = y;
        this.hasMoved = false;
    }

    draw() {
        ctx.fillStyle= "red";
        ctx.font = '15px serif';
        ctx.fillText(this.team[0] + (this.type.toUpperCase()), this.x*75 + 10/((this.team[0]+this.type).length-4), this.y*75 + 40);
    }

    move(newx, newy) {
        board[this.x][this.y] = null; 
        this.x = newx; 
        this.y = newy; 
        console.log("Moving"); 
        this.hasMoved = true;
        board[this.x][this.y] = this;
        drawBoard(); 
    } 

    getValidMoves() {
        switch (this.type) {
            case "pawn":
                return pawnMoves(this); 
            case "rook":
                return rookMoves(this);
            case "bishop":
                return bishopMoves(this);
            case "knight":
                return knightMoves(this);
            case "king":
                return kingMoves(this);
            case "queen":
                return queenMoves(this);
        }
        return null;
    }
}
  