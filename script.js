let board = null;
let turn = null;
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
    startGame();
    setUpMouseEvent();
};

function startGame() {
    board = new Board();
    board.setUpPieces();
    turn = "black";
    nextTurn();
    drawBoard();
}       

function makeVirtualBoard() {
    return new Board(board);
}

function canUnCheck(team) {
    moves = new Array();
    for(let y=0;y<8;y++) {
        for(let x=0;x<8;x++) {
            if(board.board[x][y] == null);
            else if(board.board[x][y].team == team) {
                vMoves = board.board[x][y].getValidMoves();
                for(let i=0;i<vMoves.length; i++) {
                    moves.push({x: x, y: y, move: vMoves[i]});
                }
            }
        }
    }
    console.log("possible moves count: " + moves.length);
    for(let  i =0; i <moves.length; i++) {
        console.log(i);
        vBoard = makeVirtualBoard();
        vBoard.board[moves[i].x][moves[i].y].move(moves[i].move.x,moves[i].move.y,vBoard);
        if(getChecked(vBoard) != team) return true;
    }
    return false;
}

function isEmpty(x,y,b) {
    if(x>7||y>7||x<0||y<0) return true;
    if(b.board[x][y] == null) return true;
    return false;
}

function nextTurn() {
    turn = (turn == "white")? "black" : "white";
    document.getElementById("turn").innerHTML = "Turn: " + turn;
    check = getChecked(board);
    if(check != null) {
        document.getElementById("check").innerHTML = "Check: " + check;
        if(!canUnCheck(check)) { 
            document.getElementById("check").innerHTML = "";
            alert(check + " has been checkmated, " + ((check == "black")? "white" : "black" ) + " has won!");
            startGame();     
        }
    }
}

function getKing(colour, b) {
    for(let y=0;y<8;y++) {
        for(let x=0;x<8;x++) {
            if(b.board[x][y] == null);
            else if(b.board[x][y].team == colour && b.board[x][y].type == "king") return b.board[x][y];
        }
    }
}

function canTake(validMoves, x, y) {
    for(let i =0; i < validMoves.length; i++) {
        if(validMoves[i].x == x && validMoves[i].y == y) return true;
    }
    return false;
}

function getChecked(b) {
    whiteKing = getKing("white", b);
    blackKing = getKing("black", b);

    for(let y=0;y<8;y++) {
        for(let x=0;x<8;x++) {
            if(b.board[x][y] == null);
            else if(canTake(b.board[x][y].getValidMoves(),whiteKing.x,whiteKing.y)) {
                return "white";
            } else if (canTake(b.board[x][y].getValidMoves(),blackKing.x,blackKing.y)) {
                return "black";
            }
        }
    }
    return null;

}
function norm(num) {
    return (Math.floor(num/75));
}

function handleMouse(mousePos) {
    var x = norm(mousePos.x);
    var y = norm(mousePos.y);
    console.log("X: " + x + " Y: " + y);
    if(selectedPiece == null) {
        selectedPiece = board.board[x][y];
        if(selectedPiece == null); 
        else if(selectedPiece.team != turn) selectedPiece = null;
    }
    else {
        console.log(selectedPiece.type);
        if(canMove(selectedPiece,x,y)) {
            selectedPiece.move(x,y,board);
            nextTurn();
            drawBoard();
        }
        else {
            console.log("invalid move");
            console.log(selectedPiece.getValidMoves());
        }
        selectedPiece = null;
    }
    drawBoard();
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
    for(let y=0;y<8;y++) for(let x=0;x<8;x++) if(board.board[x][y] != null) board.board[x][y].draw();
    drawValidMoves(selectedPiece);
}

function drawLine(y) {
    start = (y%2 == 0)? 1 : 0;
    for (;start < 8; start+=2) {
        drawSquare(start,y, " #46AA22");
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
    for(let i =0; i < validMoves.length; i++ ){
        if(validMoves[i].x == x && validMoves[i].y == y) return true;
    }
    return false;
}

function pushIfValid(piece, array, position) {
    keepGoing = true;
    if(position.x < 0 || position.y < 0 || position.x > 7 || position.y > 7) return true;
    if(board.board[position.x][position.y] != null) {
        if(board.board[position.x][position.y].team == piece.team) return false;
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
        drawSquare(element.x,element.y,"cyan");
    });
}

function pawnMoves(piece, b) {
    validMoves = new Array();
    up = (piece.team == "black")? 1 : -1;
    if(isEmpty(piece.x,piece.y+up,b)) {
        keepGoing = pushIfValid(piece, validMoves, {x: piece.x, y: piece.y+up});
        if(!piece.hasMoved && keepGoing && isEmpty(piece.x, piece.y+(2*up),b)) { pushIfValid(piece, validMoves, {x: piece.x, y: piece.y+(2*up)}); } 
    }
    if(!isEmpty(piece.x+1,piece.y+up,b)) { pushIfValid(piece, validMoves, {x: piece.x+1, y: piece.y + up})};
    if(!isEmpty(piece.x-1,piece.y+up,b)) { pushIfValid(piece, validMoves, {x: piece.x-1, y: piece.y + up})};
    return validMoves;
} 
function rookMoves(piece) {
    validMoves = new Array();
    up = true;
    down = true;
    left = true;
    right = true;
    for(let i = 1; i < 8; i++) {
        if(left)  { left  = pushIfValid(piece, validMoves,{x: piece.x-i, y: piece.y}); }
        if(right) { right = pushIfValid(piece, validMoves,{x: piece.x+i, y: piece.y}); }
        if(up)    { up    = pushIfValid(piece, validMoves,{x: piece.x, y: piece.y-i}); }
        if(down)  { down  = pushIfValid(piece, validMoves,{x: piece.x, y: piece.y+i}); }
    }
    return validMoves;
}
function bishopMoves(piece) {
    validMoves = new Array();
    up = true;
    down = true;
    left = true;
    right = true;
    for(let i = 1; i < 8; i++) {
        if(i == 0 ) continue;
        if(left)  { left  = pushIfValid(piece, validMoves,{x: piece.x-i, y: piece.y + i}); }
        if(right) { right = pushIfValid(piece, validMoves,{x: piece.x+i, y: piece.y + i}); }
        if(up)    { up    = pushIfValid(piece, validMoves,{x: piece.x+i, y: piece.y - i}); }
        if(down)  { down  = pushIfValid(piece, validMoves,{x: piece.x-i, y: piece.y - i}); }
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
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            if(i == 0 && j == 0) { continue; }
            pushIfValid(piece, validMoves,{x: piece.x + i, y: piece.y + j});
        }
    } 
    return validMoves;
}
function queenMoves(piece) {
    return rookMoves(piece).concat(bishopMoves(piece));
}

class Board {
    constructor(b) {
        this.board = new Array(8);
        if(b == undefined) {
            this.setUpPieces();
        } else {
            this.blank();
            for (var i = 0; i < 8; i++) {
                this.board[i] = new Array(8);
                for(let j = 0; j < 8; j++) {
                    this.board[i][j] = (b.board[i][j] == null)? null : new Piece(b.board[i][j]);
                }
            }
        }
    }


    blank() {
        for (var i = 0; i < 8; i++) {
            this.board[i] = new Array(8);
            for(let j = 0; j < 8; j++) {
                this.board[i][j] = null;
            }
        }
    }

    setUpPieces() {
        this.blank();
        this.addSymmetrical("rook",0,0);
        this.addSymmetrical("rook",7,0);
        this.addSymmetrical("knight",1,0);
        this.addSymmetrical("knight",6,0);
        this.addSymmetrical("bishop",2,0);
        this.addSymmetrical("bishop",5,0);
        this.addSymmetrical("queen",3,0);
        this.addSymmetrical("king",4,0);
        for(let i =0; i < 8; i++) { 
            this.addSymmetrical("pawn", i,1); 
        }
    }
    
    addSymmetrical(type, x, y) {
        this.board[x][y]   = new Piece("black", type,x,y);
        this.board[x][7-y] = new Piece("white", type,x,7-y);
    }
}

class Piece {
    constructor(team, type, x, y) {
        if(type == undefined) {
            let p = team;
            this.team = p.team;
            this.type = p.type;
            this.x = p.x;
            this.y = p.y;
            this.hasMoved = p.hasMoved;
        } else {
            this.team = team;
            this.type = type;
            this.x = x;
            this.y = y;
            this.hasMoved = false;
        }
    }

    draw() {
        ctx.fillStyle= "red";
        ctx.font = '15px serif';
        let str = this.team[0] + (this.type.toUpperCase());
        ctx.drawImage(document.getElementById(str), 75*this.x, 75*this.y, 75, 75)
    }

    move(newx, newy, b) {
        b.board[this.x][this.y] = null; 
        this.x = newx; 
        this.y = newy; 
        this.hasMoved = true;
        b.board[this.x][this.y] = this;
    } 

    getValidMoves() {
        switch (this.type) {
            case "pawn":
                return pawnMoves(this,board); 
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
  