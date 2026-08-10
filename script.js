/* =========================================
   SNAKE GAME
   JAVASCRIPT
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const gameBoard = document.getElementById("gameBoard");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const statusText = document.getElementById("statusText");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreElement = document.getElementById("finalScore");
const playAgainButton = document.getElementById("playAgainButton");

const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


/* =========================================
   GAME SETTINGS
========================================= */

const GRID_SIZE = 20;

const INITIAL_SPEED = 140;

const MIN_SPEED = 60;

const SPEED_INCREASE = 4;


/* =========================================
   GAME VARIABLES
========================================= */

let snake = [];

let food = {
    x: 0,
    y: 0
};

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;

let highScore = Number(
    localStorage.getItem("snakeHighScore")
) || 0;

let gameSpeed = INITIAL_SPEED;

let gameLoop = null;

let gameRunning = false;

let gamePaused = false;


/* =========================================
   INITIAL SETUP
========================================= */

highScoreElement.textContent = highScore;

initializeGame();


/* =========================================
   INITIALIZE GAME
========================================= */

function initializeGame() {

    snake = [

        {
            x: 10,
            y: 10
        },

        {
            x: 9,
            y: 10
        },

        {
            x: 8,
            y: 10
        }

    ];


    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    score = 0;

    gameSpeed = INITIAL_SPEED;

    gameRunning = false;

    gamePaused = false;


    scoreElement.textContent = score;

    statusText.textContent = "Press Start to Play";

    pauseButton.textContent = "Pause";


    generateFood();

    drawGame();

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    if (gameRunning) {
        return;
    }


    gameRunning = true;

    gamePaused = false;

    statusText.textContent = "Game Started!";


    startButton.textContent = "Playing...";


    gameLoop = setInterval(
        updateGame,
        gameSpeed
    );

}


/* =========================================
   UPDATE GAME
========================================= */

function updateGame() {

    if (!gameRunning || gamePaused) {
        return;
    }


    direction = nextDirection;


    const head = {

        x: snake[0].x + direction.x,

        y: snake[0].y + direction.y

    };


    /* =====================================
       WALL COLLISION
    ===================================== */

    if (

        head.x < 0 ||

        head.x >= GRID_SIZE ||

        head.y < 0 ||

        head.y >= GRID_SIZE

    ) {

        endGame();

        return;

    }


    /* =====================================
       SELF COLLISION
    ===================================== */

    if (isSnakeCollision(head)) {

        endGame();

        return;

    }


    /* =====================================
       ADD NEW HEAD
    ===================================== */

    snake.unshift(head);


    /* =====================================
       CHECK FOOD
    ===================================== */

    if (

        head.x === food.x &&

        head.y === food.y

    ) {

        eatFood();

    } else {

        snake.pop();

    }


    drawGame();

}


/* =========================================
   CHECK SNAKE COLLISION
========================================= */

function isSnakeCollision(head) {

    return snake.some(

        segment =>

            segment.x === head.x &&

            segment.y === head.y

    );

}


/* =========================================
   EAT FOOD
========================================= */

function eatFood() {

    score++;

    scoreElement.textContent = score;


    /* =====================================
       HIGH SCORE
    ===================================== */

    if (score > highScore) {

        highScore = score;

        highScoreElement.textContent = highScore;

        localStorage.setItem(
            "snakeHighScore",
            highScore
        );

    }


    /* =====================================
       GENERATE NEW FOOD
    ===================================== */

    generateFood();


    /* =====================================
       INCREASE DIFFICULTY
    ===================================== */

    increaseSpeed();


    statusText.textContent = "Yum! Keep going!";

}


/* =========================================
   GENERATE FOOD
========================================= */

function generateFood() {

    let validPosition = false;


    while (!validPosition) {

        food = {

            x: Math.floor(
                Math.random() * GRID_SIZE
            ),

            y: Math.floor(
                Math.random() * GRID_SIZE
            )

        };


        validPosition = !snake.some(

            segment =>

                segment.x === food.x &&

                segment.y === food.y

        );

    }

}


/* =========================================
   INCREASE SPEED
========================================= */

function increaseSpeed() {

    gameSpeed = Math.max(

        MIN_SPEED,

        INITIAL_SPEED -
        (score * SPEED_INCREASE)

    );


    if (gameRunning) {

        clearInterval(gameLoop);


        gameLoop = setInterval(

            updateGame,

            gameSpeed

        );

    }

}


/* =========================================
   DRAW GAME
========================================= */

function drawGame() {

    gameBoard.innerHTML = "";


    /* =====================================
       DRAW SNAKE
    ===================================== */

    snake.forEach(

        (segment, index) => {

            const snakeElement =
                document.createElement("div");


            snakeElement.classList.add("snake");


            if (index === 0) {

                snakeElement.classList.add("head");


                addSnakeEyes(
                    snakeElement
                );

            }


            snakeElement.style.left =
                `${segment.x * 5}%`;


            snakeElement.style.top =
                `${segment.y * 5}%`;


            gameBoard.appendChild(
                snakeElement
            );

        }

    );


    /* =====================================
       DRAW FOOD
    ===================================== */

    const foodElement =
        document.createElement("div");


    foodElement.classList.add("food");


    foodElement.style.left =
        `${food.x * 5}%`;


    foodElement.style.top =
        `${food.y * 5}%`;


    gameBoard.appendChild(
        foodElement
    );

}


/* =========================================
   ADD SNAKE EYES
========================================= */

function addSnakeEyes(snakeElement) {

    const leftEye =
        document.createElement("span");

    const rightEye =
        document.createElement("span");


    leftEye.classList.add(
        "snake-eye",
        "left"
    );


    rightEye.classList.add(
        "snake-eye",
        "right"
    );


    snakeElement.appendChild(leftEye);

    snakeElement.appendChild(rightEye);

}


/* =========================================
   CHANGE DIRECTION
========================================= */

function changeDirection(newDirection) {

    if (!gameRunning) {
        return;
    }


    if (gamePaused) {
        return;
    }


    /*
        Prevent the snake from immediately
        reversing into itself.
    */


    if (

        newDirection.x === -direction.x &&

        newDirection.y === -direction.y

    ) {

        return;

    }


    nextDirection = newDirection;

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(

    "keydown",

    function(event) {

        const key =
            event.key.toLowerCase();


        /* ================================
           ARROW KEYS
        ================================= */

        if (key === "arrowup") {

            event.preventDefault();

            changeDirection({
                x: 0,
                y: -1
            });

        }


        else if (key === "arrowdown") {

            event.preventDefault();

            changeDirection({
                x: 0,
                y: 1
            });

        }


        else if (key === "arrowleft") {

            event.preventDefault();

            changeDirection({
                x: -1,
                y: 0
            });

        }


        else if (key === "arrowright") {

            event.preventDefault();

            changeDirection({
                x: 1,
                y: 0
            });

        }


        /* ================================
           WASD CONTROLS
        ================================= */

        else if (key === "w") {

            event.preventDefault();

            changeDirection({
                x: 0,
                y: -1
            });

        }


        else if (key === "s") {

            event.preventDefault();

            changeDirection({
                x: 0,
                y: 1
            });

        }


        else if (key === "a") {

            event.preventDefault();

            changeDirection({
                x: -1,
                y: 0
            });

        }


        else if (key === "d") {

            event.preventDefault();

            changeDirection({
                x: 1,
                y: 0
            });

        }


        /* ================================
           SPACE = PAUSE
        ================================= */

        else if (key === " ") {

            event.preventDefault();

            togglePause();

        }

    }

);


/* =========================================
   MOBILE CONTROLS
========================================= */

upButton.addEventListener(

    "click",

    function() {

        changeDirection({
            x: 0,
            y: -1
        });

    }

);


downButton.addEventListener(

    "click",

    function() {

        changeDirection({
            x: 0,
            y: 1
        });

    }

);


leftButton.addEventListener(

    "click",

    function() {

        changeDirection({
            x: -1,
            y: 0
        });

    }

);


rightButton.addEventListener(

    "click",

    function() {

        changeDirection({
            x: 1,
            y: 0
        });

    }

);


/* =========================================
   PAUSE GAME
========================================= */

function togglePause() {

    if (!gameRunning) {
        return;
    }


    gamePaused = !gamePaused;


    if (gamePaused) {

        pauseButton.textContent = "Resume";

        statusText.textContent = "Game Paused";

    } else {

        pauseButton.textContent = "Pause";

        statusText.textContent = "Keep Going!";

    }

}


/* =========================================
   END GAME
========================================= */

function endGame() {

    gameRunning = false;

    gamePaused = false;


    clearInterval(gameLoop);


    gameLoop = null;


    startButton.textContent = "Start Game";

    pauseButton.textContent = "Pause";


    statusText.textContent = "Game Over";


    finalScoreElement.textContent = score;


    gameOverOverlay.classList.remove(
        "hidden"
    );


    drawGame();

}


/* =========================================
   RESTART GAME
========================================= */

function restartGame() {

    clearInterval(gameLoop);

    gameLoop = null;


    gameOverOverlay.classList.add(
        "hidden"
    );


    initializeGame();

}


/* =========================================
   PLAY AGAIN
========================================= */

function playAgain() {

    restartGame();

    startGame();

}


/* =========================================
   BUTTON EVENTS
========================================= */

startButton.addEventListener(

    "click",

    startGame

);


pauseButton.addEventListener(

    "click",

    togglePause

);


restartButton.addEventListener(

    "click",

    restartGame

);


playAgainButton.addEventListener(

    "click",

    playAgain

);


/* =========================================
   PREVENT MOBILE SCROLLING
========================================= */

document.addEventListener(

    "touchmove",

    function(event) {

        if (
            event.target.closest(
                ".mobile-controls"
            )
        ) {

            event.preventDefault();

        }

    },

    {
        passive: false
    }

);
