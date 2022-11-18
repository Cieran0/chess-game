var whitePieces = new Array();
var blackPieces = new Array();

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

function selectPiece(x, y) {
    for(i =0; i< whitePieces.length; i++) {
        if(whitePieces[i].x == x && whitePieces[i].y == y) {
            selectedPiece = whitePieces[i];
            return;
        }

    }
    for(i =0; i< blackPieces.length; i++) {
        if(blackPieces[i].x == x && blackPieces[i].y == y) {
            selectedPiece = blackPieces[i];
            return;
        }
    }
    selectedPiece =  null;
}

function norm(num) {
    return (Math.floor(num/75));
}

function handleMouse(mousePos) {
    var x = norm(mousePos.x);
    var y = norm(mousePos.y);
    console.log("X: " + x + " Y: " + y);
    if(selectedPiece == null) {
        selectPiece(x,y);
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
    blackPieces.push(new Piece("black", type,x,y));
    whitePieces.push(new Piece("white", type,x,7-y));
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
    whitePieces.forEach(element => {
        element.draw();
    });

    blackPieces.forEach(element => {
        element.draw();
    });
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

function pushIfValid(array, position) {
    if(position.x > 7 || position.x < 0 || position.y > 7 || position.y < 0) { return; }
    array.push(position);
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
    validMoves = new Array();
    if(!piece.hasMoved) { pushIfValid(validMoves, ( (piece.team == "black")? {x: piece.x, y: piece.y+2} : {x: piece.x, y: piece.y-2})); } 
    pushIfValid(validMoves, ( (piece.team == "black")? {x: piece.x, y: piece.y+1} : {x: piece.x, y: piece.y-1}));
    return validMoves;
} 
function rookMoves(piece) {
    validMoves = new Array();
    for(i = 0; i < 8; i++) {
        if(i == piece.x) continue;
        pushIfValid(validMoves,{x: i, y: piece.y});
    }
    for(i = 0; i < 8; i++) {
        if(i == piece.y) continue;
        pushIfValid(validMoves,{x: piece.x, y: i});
    }
    return validMoves;
}
function bishopMoves(piece) {
    validMoves = new Array();
    for(i = -7; i < 8; i++) {
        if(i == 0 ) continue;
        pushIfValid(validMoves, {x: piece.x + i, y: piece.y + i})
        pushIfValid(validMoves, {x: piece.x - i, y: piece.y + i})
    }
    return validMoves;
}
function knightMoves(piece) {
    // TODO: Find better way of checking valid moves for the knight! 
    validMoves = new Array();
    pushIfValid(validMoves, {x: piece.x-1, y: piece.y - 2});
    pushIfValid(validMoves, {x: piece.x+1, y: piece.y - 2});
    pushIfValid(validMoves, {x: piece.x-1, y: piece.y + 2});
    pushIfValid(validMoves, {x: piece.x+1, y: piece.y + 2});
    pushIfValid(validMoves, {x: piece.x-2, y: piece.y - 1});
    pushIfValid(validMoves, {x: piece.x+2, y: piece.y - 1});
    pushIfValid(validMoves, {x: piece.x-2, y: piece.y + 1});
    pushIfValid(validMoves, {x: piece.x+2, y: piece.y + 1});
    return validMoves;
}
function kingMoves(piece) {
    validMoves = new Array();
    for(i = -1; i < 2; i++) {
        for(j = -1; j < 2; j++) {
            if(i == 0 && j == 0) { continue; }
            pushIfValid(validMoves,{x: piece.x + i, y: piece.y + j});
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

    move(newx, newy) { this.x = newx; this.y = newy; console.log("Moving"); drawBoard(); this.hasMoved = true;} 

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
  