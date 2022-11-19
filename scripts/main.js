let game = null;
let selectedPiece = null;

window.onload = function() {
    MouseHandler.setUpMouseEvent();
    restart();
};

function restart() {
    selectedPiece = null;
    game = new Game();
    Canvas.drawBoard();
}

function checkMate(loser) {
    var winner = (loser == "white")? "black" : "white";
    alert("Checkmate!\n"+winner+" has won!\nGG");
    restart();
}

function contains(array, pos) {
    var result = false;
    array.forEach(element => {
        if(element.x == pos.x && element.y == pos.y) {
            result = true;
        }
    });
    return result;
}



