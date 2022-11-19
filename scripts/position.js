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