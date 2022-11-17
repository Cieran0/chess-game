var whitePieces = new Array();
var blackPieces = new Array();

let selectedPiece = null;

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
        selectedPiece.move(x,y);
        selectedPiece = null;
    }
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
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, 800, 800);
    ctx.fillStyle = "white";
    ctx.fill();
    for (i = 0; i <8; i++) {
        drawLine(ctx,i);
    }
    whitePieces.forEach(element => {
        element.draw(ctx);
    });

    blackPieces.forEach(element => {
        element.draw(ctx);
    });
}

function drawLine(ctx, y) {
    start = (y%2 == 0)? 1 : 0;
    for (;start < 8; start+=2) {
        drawSquare(ctx,start,y);
    }
}

function drawSquare(ctx, x, y) {
    ctx.beginPath();
    ctx.rect(x*75, y*75, 75, 75);
    ctx.fillStyle = "black";
    ctx.fill();
}

class Piece {
    constructor(team, type, x, y) {
        this.team = team;
        this.type = type;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle= "red";
        ctx.font = '15px serif';
        ctx.fillText(this.team[0] + (this.type.toUpperCase()), this.x*75 + 10/((this.team[0]+this.type).length-4), this.y*75 + 40);
    }

    move(newx, newy) { this.x = newx; this.y = newy; console.log("Moving"); drawBoard();} 

}
  