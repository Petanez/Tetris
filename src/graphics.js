function clearBoard() {
    ctx.clearRect(0 + borderLineWidth, 0 + borderLineWidth, c.width - borderLineWidth * 2, c.height - borderLineWidth * 2);
}

function drawBorders() {
    let borderLineAdjustment = 5;
    ctx.beginPath();
    ctx.lineWidth = borderLineWidth;
    ctx.strokeStyle = borderColor;
    ctx.moveTo(borderLineAdjustment, 0);
    ctx.lineTo(borderLineAdjustment, c.height - borderLineAdjustment);
    ctx.lineTo(c.width - borderLineAdjustment, c.height - borderLineAdjustment);
    ctx.lineTo(c.width - borderLineAdjustment, 0);
    ctx.stroke();
}

function drawSquare(x, y) {
    let sLineWidth = 1;
    ctx.beginPath();
    ctx.lineWidth = sLineWidth;
    ctx.strokeStyle = "black";
    //  draw square lines
    // ctx.strokeRect(borderLineWidth + sLineWidth + blockSize * x, borderLineWidth + sLineWidth + blockSize * y, blockSize - sLineWidth * 2, blockSize - sLineWidth * 2);
    //  Linear gradience
    let sq = ctx.createLinearGradient(borderLineWidth + blockSize * x, borderLineWidth + blockSize * y, blockSize * x + blockSize, blockSize * y + blockSize);
    sq.addColorStop(0, squareColor1)
    // sq.addColorStop(1, "#E7DDDB")
    sq.addColorStop(0.8, squareColor2)
    ctx.fillStyle = sq;
    ctx.fillRect(borderLineWidth + blockSize * x, borderLineWidth + blockSize * y, blockSize, blockSize);
    ctx.stroke();
}

function drawPiece(p) {
    for (let i = 0; i < p.length; i++) {
        if (p[i].isOccupied) {
            drawSquare(p[i].x, p[i].y);
        }
    }
}

function drawBoard(p) {
    drawBorders();
    for (let y = board.length - 1; y > 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x].isOccupied) {
                drawSquare(x, y);
            }
        }
    }
}

function drawEverything() {
    ctx.clearRect(0, 0, c.width, c.height);     
    drawBoard();
    drawPiece(piece.PIECE);
}

let gameOverInterval;
let gameOverTextFinished = true;
// gameOverTextFinished is to prevent premature restarting of the game
function displayGameOver() {
    console.log("inside display game over");
    gameOverTextFinished = false;
    let opacity = 0;
    let txtShadow = 0;
    let intervalTime = 5;
    gameOverInterval = setInterval(function() {
        gameOverElement.setAttribute("style", `opacity: ${opacity}%; text-shadow: 0px 0px ${txtShadow}px black;`)     
        // document.getElementById("gOvr").setAttribute("style", `opacity: ${opacity}%; text-shadow: ${-txtShadow}px ${txtShadow}px ${txtShadow}px black;`)     
        opacity++;      
        txtShadow += 0.2;
        if (opacity >= 100) {
            window.clearInterval(gameOverInterval);
            gameOverTextFinished = true;
            normButton.innerHTML = "START GAME";
            return;
        }
    }, intervalTime)
    return;
}

let levelOpacityInterval;
function displayLevelText() {
    let opacity = 100;       
    let leftMargin = 200;     
    let intervalTime = 25;
    levelElement.setAttribute("style", "margin-left: 200px;")
    levelElement.innerHTML = "Level " + level;
    levelOpacityInterval = setInterval(function() {
        levelElement.setAttribute("style", `opacity: ${opacity}%; margin-left: ${leftMargin}px;`)   
        leftMargin -= 2.9;  
        opacity--;      
        if (opacity <= 30) {
            window.clearInterval(levelOpacityInterval);
        }
    }, intervalTime)
}

function displayFinalScore() {
    finalScoreElement.innerHTML = "Your score: " + score;
}