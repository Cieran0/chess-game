function closeDialog() {
    document.querySelector('dialog').removeAttribute('open');
}

function openDialog() {
    document.getElementById("dialog").open = true;
}

function setButtonCSS(team) {
    document.querySelectorAll('button').forEach($button => 
        $button.style.setProperty("background-image","url(\"pieces/" + team[0] + ($button.id).toUpperCase() + ".png\")")
    );
    document.getElementById("dialog").style.setProperty("margin-top", (team == "white")? "4.75%" : "29.125%");
}

function setUpButtons() {
    document.querySelectorAll('button').forEach($button => 
        $button.onclick = function() {
            game.promote($button.id);
            closeDialog();
            Canvas.drawBoard();
        });
}

function turnButtonsOn(team) {
    setButtonCSS(team);
    openDialog();
    setUpButtons();
}