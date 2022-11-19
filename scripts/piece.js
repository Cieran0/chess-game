class Piece {
    constructor(type, team) {
        this.type = type;
        this.team = team;
        this.hasMoved = false;
    }

    copy() {
        var p = new Piece(this.type,this.team);
        p.hasMoved = this.hasMoved;
        return p;
    }
}