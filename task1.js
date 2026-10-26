const MIN = 1;
const MAX = 20;
const START_LIVES = 3;
const ZERO = 0;
const STEP = 1;
let current;
let lives;
let streak;
let best = ZERO;
let message;
const number = document.getElementById("number");
const stats = document.getElementById("stats");
const feedback = document.getElementById("game-message");
const higher = document.getElementById("higher");
const lower = document.getElementById("lower");
document.getElementById("rules").textContent = "Guess the next number from " + MIN + " to " + MAX + ". Equal numbers count as correct. You have " + START_LIVES + " lives.";
function randomNumber() {
  return Math.floor(Math.random() * (MAX - MIN + STEP)) + MIN;
}
function render() {
  number.textContent = current;
  stats.textContent = "Lives: " + lives + " | Streak: " + streak + " | Best: " + best;
  feedback.textContent = message;
  higher.disabled = lives === ZERO;
  lower.disabled = lives === ZERO;
}
function move(choice) {
  if (lives === ZERO || (choice !== "higher" && choice !== "lower")) {
    message = "Move rejected. Restart if the game is over.";
    render();
    return;
  }
  const next = randomNumber();
  const correct = (choice === "higher" && next > current) || (choice === "lower" && next < current);
  feedback.classList.remove("win", "loss");
  if (next === current || correct) {
    streak += STEP;
    message = "Correct! " + current + " to " + next;
    if (next === current) message = "Equal numbers! Correct guess.";
    feedback.classList.add("win");
  } else {
    lives -= STEP;
    streak = ZERO;
    message = "Wrong guess. " + current + " to " + next;
    feedback.classList.add("loss");
  }
  if (streak > best) best = streak;
  current = next;
  if (lives === ZERO) message += " Game over. Press Restart.";
  render();
}
function restart() {
  current = randomNumber();
  lives = START_LIVES;
  streak = ZERO;
  message = "Choose Higher or Lower.";
  feedback.classList.remove("win", "loss");
  render();
}
higher.addEventListener("click", function () { move("higher"); });
lower.addEventListener("click", function () { move("lower"); });
document.getElementById("restart").addEventListener("click", restart);
restart();
