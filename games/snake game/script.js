// Set up the canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let savedHighScore = localStorage.getItem("highScore");

// Set up the snake
const snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150}];

// Set the initial direction
let dx = 15;
let dy = 0;

// Set the initial score to 0
let score = 0;
let highScore = 0;
// Set the initial food position
let food = {x: 300, y: 300};

// Set the size of each cell in the grid
const CELL_SIZE = 15;
const MIN_DISTANCE = 15;
// Set the width and height of the canvas in cells
const WIDTH = canvas.width / CELL_SIZE;
const HEIGHT = canvas.height / CELL_SIZE;

ctx.strokeStyle = "#67ff85";

function updateScore() {
  document.getElementById("score").innerHTML = "Score: " + score;
  // Update the high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("high-score").innerHTML = "High Score: " + localStorage.getItem("highScore");
}

window.onload = function() {
  document.getElementById("high-score").innerHTML = "High Score: " + localStorage.getItem("highScore");
}

function gameOver() {
  console.log("Game over!");
  clearTimeout(timeout);
}

// Set up the restart game function
function restartGame() {
  location.reload();

}

document.getElementById("restart-button").addEventListener("click", restartGame);

// Draw the snake on the canvas
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = "#67ff85";
    ctx.filter = "drop-shadow(0 0 10px #67ff85)";
    ctx.fillRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);
  });
}

// Draw the food on the canvas
function drawFood() {
  ctx.fillStyle = "#ff4040";
  ctx.filter = "drop-shadow(0 0 10px #ED1D1D)";
  ctx.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
}

// Move the snake
function moveSnake() {
  // Get the current position of the snake's head
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  // Add the new head to the front of the snake
  snake.unshift(head);

  // Check if the snake has eaten the food
  if (snake[0].x === food.x && snake[0].y === food.y) {
    // Increment the score
    score++;

    // Generate a new food position
    food = {
      x: Math.floor(Math.random() * (WIDTH - MIN_DISTANCE)) * CELL_SIZE + MIN_DISTANCE,
      y: Math.floor(Math.random() * (HEIGHT - MIN_DISTANCE)) * CELL_SIZE + MIN_DISTANCE
    };
  } else {
    // Remove the tail of the snake
    snake.pop();
  }
}

// Check for collision with the walls
function checkCollision() {
  if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
    // Collision with a wall, stop the game
    document.getElementById("message").style.display = "block";
    gameOver();
  }
}

// Check for collision with the snake's own body
function checkSelfCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      // Collision with the snake's own body, stop the game
      document.getElementById("message").style.display = "block";
      gameOver();
    }
  }
}

// Set up the game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  checkCollision();
  checkSelfCollision();

  // Move the snake
  moveSnake();

  // Draw the snake and the food
  drawSnake();
  drawFood();


  // Set up the next frame of the game loop
  updateScore();
  setTimeout(gameLoop, 80);
}

// Set up the key event listeners
document.addEventListener("keydown", event => {
    // Get the key code of the pressed key
    const key = event.keyCode;
  
    // Set the direction based on the key code
    if (key === 37 && dx === 0) {
      dx = -CELL_SIZE;
      dy = 0;
    } else if (key === 38 && dy === 0) {
      dx = 0;
      dy = -CELL_SIZE;
    } else if (key === 39 && dx === 0){
        dx = CELL_SIZE;
        dy = 0;
    } else if (key === 40 && dy === 0) {
        dx = 0;
        dy = CELL_SIZE;
    }
});

gameLoop();