    //#region Configuration
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");
    const blockSize = 35;
    const borderLineWidth = 10;
    const gridHeight = blockSize * 24;
    const gridWidth = blockSize * 10;
    const scoreBoardElement = document.getElementById("scoreboard");
    const scoreElement = document.getElementById("score");
    const levelElement = document.getElementById("lvl");
    const finalScoreElement = document.getElementById("finalScore");
    const gameOverElement = document.getElementById("gOvr");
    const ezButton = document.getElementById("ezButton");
    const normButton = document.getElementById("normButton");
    const gamePausedElement = document.getElementById("gamePaused");
    const gameElem = document.querySelector(".game");
    const themeSwitch = document.querySelector("#themeSwitch");
    const hideControls = document.querySelector("#toggleControls")
    const hideControlsArrow = document.querySelector(".hide-controls__arrow")
    const gameControls = document.querySelector(".game-info__controls")
    // console.log(themeSwitch)

    hideControls.onclick = () => {
        let isClicked = hideControls.getAttribute("data-clicked") == "true"
        console.log(isClicked)
        if (isClicked) {
            gameControls.classList.add("hidden")
            hideControlsArrow.classList.add("upside-down")
            
        } else {
            gameControls.classList.remove("hidden")
            hideControlsArrow.classList.remove("upside-down")
        }
        hideControls.dataset.clicked = !isClicked
    }

    let isPolarized = document.body.classList.contains("polarized")

    let borderColor = "black";
    
    let squareColor1 = "white";
    let squareColor2 = "black";
    
    themeSwitch.onclick = () => {
        if (document.body.classList.contains("polarized")) {
            document.body.classList.remove("polarized")
            squareColor1 = "white";
            squareColor2 = "black";
            borderColor = "black";
        } else {
            document.body.classList.add("polarized")
            squareColor1 = "black";
            squareColor2 = "white";
            borderColor = "white";
        }
        drawEverything();
    }
    // const squareColor1 = "black";
    // const squareColor2 = "white";


    // const squareColor1 = "yellow";
    // const squareColor2 = "red";

    c.height = gridHeight + borderLineWidth * 2;
    c.width = gridWidth + borderLineWidth * 2;
    // gameElem.width = c.width

    let defaultFps = 2;
    let level;
    let board; 
    let piece;
    let isPaused = false;
    let downIsPressed = false;
    let isEz = false;
    let gameOver = false;
    let score = 0;
//#endregion
    scoreElement.innerHTML = score;
    //  "Easy" button changes isEz's state
    // ezButton.onclick = function() {
    //     if (gameOverTextFinished) {
    //         if (levelOpacityInterval != null) { clearInterval(levelOpacityInterval); }
    //         if (gameOverInterval != null) { clearInterval(gameOverInterval); }  
    //         gameOverElement.setAttribute("style", "opacity: 0%;")
    //         clearBoard(); 
    //         finalScoreElement.innerHTML = "";
    //         levelElement.setAttribute("style", "letter-spacing: 0px; background: none; opacity: 100;");
    //         document.getElementById("scoreboard").setAttribute("style", "opacity:100;");
    //         gameOver = false;
    //         isEz = true;
    //         playGame();
    //     }
    // }
    //  "normButtonal" button changes isEz's state
    normButton.onclick = function() {
        if (gameOverTextFinished) {     
            if (levelOpacityInterval != null) { clearInterval(levelOpacityInterval); }  
            if (gameOverInterval != null) { clearInterval(gameOverInterval); }  
            clearBoard(); 
            restartGame();
        }
    }
    
    window.onload = () => {           
        drawBorders();
    }

    let mainInterval;
    let secondaryInterval;
    let mainIntervalDivident = 1500;
    function playGame() {
        if (mainInterval != null) { clearInterval(mainInterval); }
        if (secondaryInterval != null) { clearInterval(secondaryInterval); }
        score = 0;
        level = 1;
        let currentLevel = level;
        let calculateTimer = (mainIntervalDivident / (defaultFps * level));
        let mainIntervalTimer = calculateTimer;
        let secondaryIntervalTimer = 100;
        displayLevelText();
        createBoard();
        setPiece();
        //  use secondary interval to detect full rows and change main interval if level changes
        secondaryInterval = setInterval(function () {
            if (!isPaused) {
                checkFullRowsAndEndCondition();
                replaceRowsAndAddToScore(rowsToReplace);
                incrementLevelAfter10Clears();
                if (currentLevel != level) {
                    moveToNextLevel();
                    currentLevel = level;
                }
            }
            if (gameOver) {
                gameOverConditionReached();
            }
            downIsPressed = false;
        }, secondaryIntervalTimer);

        // Main interval to lower pieces
        mainInterval = setInterval(runLevel, mainIntervalTimer);
    }
//#endregion