class MouseHandler {

    static getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return Position.norm(new Position(
            /*x:*/ evt.clientX - rect.left,
            /*y:*/ evt.clientY - rect.top
        ));
    }

    static handleMouse(mousePos) {
        if(game.promo != null) {
            return;
        }
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