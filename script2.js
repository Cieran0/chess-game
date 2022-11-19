let game = null;
let selectedPiece = null;

window.onload = function() {
    MouseHandler.setUpMouseEvent();
    game = new Game();
    Canvas.drawBoard();
};

 function contains(array, pos) {
    var result = false;
    array.forEach(element => {
        if(element.x == pos.x && element.y == pos.y) {
            result = true;
        }
    });
    return result;
}

class Canvas {

    static ctx;

    static drawBoard() {
        var c = document.getElementById('board');
        this.ctx = c.getContext("2d");
        this.ctx.beginPath();
        this.ctx.rect(0, 0, 800, 800);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        for (let i = 0; i <8; i++) {
            this.drawLine(i);
        }
        this.drawValidMoves();
        this.drawPieces();
        document.getElementById("turn").innerHTML = "Turn: " + game.turn;
        document.getElementById("check").innerHTML = "Check: " + game.check;
    }
    
    static drawLine(y) {
        var start = (y%2 == 0)? 1 : 0;
        for (;start < 8; start+=2) {
            this.drawSquare(start,y, " #46AA22");
        }
    }
    
    static drawSquare(x, y, colour) {
        this.ctx.beginPath();
        this.ctx.rect(x*75, y*75, 75, 75);
        this.ctx.fillStyle = colour;
        this.ctx.fill();
    }

    static drawPiece(x,y) {
        if(game.board[x][y] == null) return;
        let str = game.board[x][y].team[0] + (game.board[x][y].type.toUpperCase());
        this.ctx.drawImage(document.getElementById(str), 75*x, 75*y, 75, 75)
    }

    static drawPieces() {
        for(let y=0;y<8;y++) for(let x=0;x<8;x++) this.drawPiece(x,y);
    }

    static drawValidMoves() {
        if(selectedPiece == null) return;
        var validMoves = game.getValidMoves(selectedPiece);
        if(validMoves == null || validMoves.length < 1) return;
        validMoves.forEach(element => {
            this.drawSquare(element.x,element.y,"cyan");
        });
    }
}

class Game {
    constructor() {
        this.board = new Array(8);
        this.blank();
        this.setUpPieces();
        this.turn = "white";
        this.check = null;
    }

    getKing(team) {
        for(let y=0; y<8; y++) {
            for(let x=0; x<8; x++) 
            {
                if(this.board[x][y] == null) continue;
                if(this.board[x][y].team == team && this.board[x][y].type == "king") {
                    return new Position(x,y); 
        }   }   }
        return null;
    }

    canTake(from, to) {
        if(this.get(from) == null) return false;
        var moves = this.getValidMoves(from);
        if(moves == null) return false;
        for(let i=0; i<moves.length; i++) {
            if(moves[i].equals(to)) return true;
        }
        return false;
    }

    setChecked() {
        var whiteKing = this.getKing("white");
        var blackKing = this.getKing("black");

        for(let y=0; y<8; y++) {
            for(let x=0; x<8; x++) 
            {
                var pos = new Position(x,y);
                var piece = this.get(pos);
                if(piece == null) continue;
                if(this.canTake(pos, (piece.team == "white")? blackKing : whiteKing)) {
                    this.check = (piece.team == "white")? "black" : "white";
                    return
                }
            }
        }
        this.check = null;

    }

    pushIfValid(array, from, to) {
        var keepGoing = true;
        if(to.x < 0 || to.y < 0 || to.x > 7 || to.y > 7) return true;
        if(this.get(to) != null) {
            if(this.get(to).team == this.get(from).team) return false;
            else keepGoing=false;
        }
        array.push(to);
        return keepGoing;
    }

    isEmpty(x,y) {
        if(x > 7 || x < 0 || y > 7 || y < 0) return true;
        if(this.board[x][y] == null) return true;
        return false;
    }

    pawnMoves(pos) {
        var validMoves = new Array();
        var up = (this.get(pos).team == "black")? 1 : -1;
        if(this.isEmpty(pos.x,pos.y+up)) {
            if(this.pushIfValid(validMoves,pos,new Position(pos.x,pos.y+up)) && this.get(pos).hasMoved == false) {
                if(this.isEmpty(pos.x,pos.y+up*2)) {
                    this.pushIfValid(validMoves,pos,new Position(pos.x,pos.y+up*2)); 
                }
            }
        }
        if(!this.isEmpty(pos.x+1,pos.y+up)) {
            this.pushIfValid(validMoves,pos,new Position(pos.x+1,pos.y+up));
        }
        if(!this.isEmpty(pos.x-1,pos.y+up)) {
            this.pushIfValid(validMoves,pos,new Position(pos.x-1,pos.y+up));
        }
        return validMoves;
    } 
    
    rookMoves(pos) {
        var validMoves = new Array();
        var up = true;
        var down = true;
        var left = true;
        var right = true;
        for(let i = 1; i < 8; i++) {
            if(left)  { left  = this.pushIfValid(validMoves,pos,new Position(pos.x-i, pos.y)); }
            if(right) { right = this.pushIfValid(validMoves,pos,new Position(pos.x+i, pos.y)); }
            if(up)    { up    = this.pushIfValid(validMoves,pos,new Position(pos.x,   pos.y-i)); }
            if(down)  { down  = this.pushIfValid(validMoves,pos,new Position(pos.x,   pos.y+i)); }
        }
        return validMoves;
    }
    
    bishopMoves(pos) {
        var validMoves = new Array();
        var up = true;
        var down = true;
        var left = true;
        var right = true;
        for(let i = 1; i < 8; i++) {
            if(i == 0 ) continue;
            if(left)  { left  = this.pushIfValid(validMoves,pos,new Position(pos.x-i, pos.y + i)); }
            if(right) { right = this.pushIfValid(validMoves,pos,new Position(pos.x+i, pos.y + i)); }
            if(up)    { up    = this.pushIfValid(validMoves,pos,new Position(pos.x+i, pos.y - i)); }
            if(down)  { down  = this.pushIfValid(validMoves,pos,new Position(pos.x-i, pos.y - i)); }
        }
        return validMoves;
    }

    knightMoves(pos) {
        // TODO: Find better way of checking valid moves for the knight! 
        var validMoves = new Array();
        this.pushIfValid(validMoves, pos, new Position(pos.x-1, pos.y - 2));
        this.pushIfValid(validMoves, pos, new Position(pos.x+1, pos.y - 2));
        this.pushIfValid(validMoves, pos, new Position(pos.x-1, pos.y + 2));
        this.pushIfValid(validMoves, pos, new Position(pos.x+1, pos.y + 2));
        this.pushIfValid(validMoves, pos, new Position(pos.x-2, pos.y - 1));
        this.pushIfValid(validMoves, pos, new Position(pos.x+2, pos.y - 1));
        this.pushIfValid(validMoves, pos, new Position(pos.x-2, pos.y + 1));
        this.pushIfValid(validMoves, pos, new Position(pos.x+2, pos.y + 1));
        return validMoves;
    }

    kingMoves(pos) {
        var validMoves = new Array();
        for(let i = -1; i < 2; i++) {
            for(let j = -1; j < 2; j++) {
                if(i == 0 && j == 0) { continue; }
                this.pushIfValid(validMoves,pos,new Position(pos.x + i, pos.y + j));
            }
        } 
        return validMoves;
    }
    
    queenMoves(pos) {
        return this.rookMoves(pos).concat(this.bishopMoves(pos));
    }

    getValidMoves(pos) {
        switch (this.get(pos).type) {
            case "pawn":
                return this.pawnMoves(pos); 
            case "rook":
                return this.rookMoves(pos);
            case "bishop":
                return this.bishopMoves(pos);
            case "knight":
                return this.knightMoves(pos);
            case "king":
                return this.kingMoves(pos);
            case "queen":
                return this.queenMoves(pos);
        }
        return null;
    }

    get(pos) {
        return this.board[pos.x][pos.y];
    }

    nextTurn() {
        console.log("nextTurn");
        this.turn = (this.turn == "black")? "white" : "black";
        this.setChecked();
    }

    move(from, to) {
        console.log("Moving!")
        this.board[from.x][from.y].hasMoved = true;
        this.board[to.x][to.y] = this.board[from.x][from.y];
        this.board[from.x][from.y] = null;
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
        this.board[x][y]   = new Piece(type, "black");
        this.board[x][7-y] = new Piece(type, "white");
    }

    blank() {
        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8);
            for(let j = 0; j < 8; j++) {
                this.board[i][j] = null;
            }
        }
    }
}

class Piece {
    constructor(type, team) {
        this.type = type;
        this.team = team;
        this.hasMoved = false;
    }
}

class MouseHandler {

    static getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return Position.norm(new Position(
            /*x:*/ evt.clientX - rect.left,
            /*y:*/ evt.clientY - rect.top
        ));
    }

    static handleMouse(mousePos) {
        if(selectedPiece == null) {
            if(game.get(mousePos) != null) {
                selectedPiece = (game.get(mousePos).team == game.turn)? Position.copyPos(mousePos) : null;
                console.log(selectedPiece)
            }
        } else {
            if(contains(game.getValidMoves(selectedPiece),mousePos)) {
                game.move(selectedPiece,mousePos);
                selectedPiece = null;
                game.nextTurn();
            } else {
                selectedPiece = null;
            }
        }
        Canvas.drawBoard();
    }

    static setUpMouseEvent() {
        var canvas = document.getElementById("board");
        canvas.addEventListener("click", function (evt) {
            MouseHandler.handleMouse(MouseHandler.getMousePos(canvas, evt));
        }, false);
    }
}

class Position {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    static copyPos(pos) {
        return new Position(pos.x,pos.y);
    }

    static norm(pos) {
        return (new Position(Math.floor(pos.x/75),Math.floor(pos.y/75)));
    }

    equals(pos) {
        if(pos == null) return false;
        if(pos.x != this.x) return false;
        if(pos.y != this.y) return false;
        return true;
    }
}