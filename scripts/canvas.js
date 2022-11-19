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
        this.drawSelectedPiece();
        this.drawValidMoves();
        this.drawPieces();
        document.getElementById("turn").innerHTML = "Turn: " + game.turn;

        document.getElementById("check").innerHTML = (game.check != null)? "Check: " + game.check : "";
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
            this.drawSquare(element.x,element.y,"#00FFFF");
        });
    }

    static drawSelectedPiece() {
        if(selectedPiece == null) return;
        this.drawSquare(selectedPiece.x,selectedPiece.y,"#006d65");
    }
}