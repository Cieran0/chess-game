class Game {
    constructor() {
        this.board = new Array(8);
        this.blank();
        this.setUpPieces();
        this.turn = "white";
        this.check = null;
        this.promo = null;
        this.main = true;
    }

    getCheckMate() {
        this.setChecked();
        if(this.check == null) return null;
        var checkMate = true;
        for(let y=0; y<8; y++) {
            for(let x=0; x<8; x++) 
            {
                var p = this.board[x][y];
                if(p == null) continue;
                if(p.team != this.check) continue;
                if(this.getValidMoves(new Position(x,y)).length >= 1) return null;  
            }
        }
        return this.check;
    }

    copyBoard() {
        var newGame = new Game();
        newGame.blank();
        for(let y=0; y<8; y++) {
            for(let x=0; x<8; x++) 
            {
                if(this.board[x][y] == null) continue;
                newGame.board[x][y] = this.board[x][y].copy();
            }
        }
        return newGame;
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

    unChecks(pos, move) {
        var vBoard = this.copyBoard();
        vBoard.main = false;
        vBoard.check = null;
        vBoard.move(pos,move);
        vBoard.setChecked();
        if(vBoard.check != this.get(pos).team) return true;
        return false;
    }

    removeMovesThatPutInCheck(pos, validMoves) {
        return validMoves.filter(m => this.unChecks(pos,m));
    }

    getValidMoves(pos) {
        var validMoves = new Array();
        switch (this.get(pos).type) {
            case "pawn":
                validMoves = this.pawnMoves(pos); 
                break;
            case "rook":
                validMoves = this.rookMoves(pos);
                break;
            case "bishop":
                validMoves = this.bishopMoves(pos);
                break;
            case "knight":
                validMoves = this.knightMoves(pos);
                break;
            case "king":
                validMoves = this.kingMoves(pos);
                break;
            case "queen":
                validMoves = this.queenMoves(pos);
                break;
        }
        if(this.main) {
            validMoves = this.removeMovesThatPutInCheck(pos,validMoves);
        }
        return validMoves;
    }

    get(pos) {
        return this.board[pos.x][pos.y];
    }

    nextTurn() {
        console.log("nextTurn");
        this.turn = (this.turn == "black")? "white" : "black";
        this.setChecked();
        var loser = this.getCheckMate()
        if(loser != null) checkMate(loser);
    }

    promote(type) {
        this.board[this.promo.x][this.promo.y].type = type;
        this.promo = null;
    }

    setPromo(pos) {
        this.promo = pos;
        turnButtonsOn(this.turn);
    }

    move(from, to) {
        console.log("Moving!")
        this.board[from.x][from.y].hasMoved = true;
        this.board[to.x][to.y] = this.board[from.x][from.y];
        this.board[from.x][from.y] = null;
        if(this.board[to.x][to.y].type == "pawn" && (to.y == 7 || to.y == 0)) {
            this.setPromo(to);
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