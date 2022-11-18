let game = null;
let selectedPiece = null;

window.onload = function() {
    MouseHandler.setUpMouseEvent();
    game = new Game();
    Canvas.drawBoard();
};

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
        this.drawPieces();
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
}

class Game {
    constructor() {
        this.board = new Array(8);
        this.blank();
        this.setUpPieces();
    }

    move(from, to) {
        console.log("Moving!")
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
            if(game.board[mousePos.x][mousePos.y] != null) {
                selectedPiece = Position.copyPos(mousePos);
                console.log(selectedPiece)
            }
        } else {
            game.move(selectedPiece,mousePos);
            selectedPiece = null;
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
}