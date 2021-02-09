document.addEventListener('keydown', function(e) {
    if (gameOver) return;
    if (isPaused && e.code != "KeyP") return;
    
    switch (e.code) {
        case "KeyP":
            if (!isPaused) {
                console.log("Game paused");
                gamePausedElement.innerHTML = "Game paused";
                isPaused = true;
            } else {
                console.log("Game resumed");
                gamePausedElement.innerHTML = "";
                isPaused = false;
            }
            break;
        case "ArrowLeft":
            movePiece("left", piece.PIECE);
            drawEverything();
            break;
        case "ArrowUp":
            // up key for rotating piece
            rotatePiece(piece);
            drawEverything();
            break;
        case "ArrowRight":
            movePiece("right", piece.PIECE);
            drawEverything();
            break;
        case "ArrowDown":
            downIsPressed = true;
            movePiece("down", piece.PIECE); 
            drawEverything();
            break;
        }
});