"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

let flipped = [];
let attempts = 0;
let matchCounter = 0;
let bestScore = Infinity;
let gameStatus = document.querySelector("#gameStatus");
let startButton = document.querySelector("#startButton");
let restartButton = document.querySelector("#restartButton");

startButton.addEventListener("click", start);
restartButton.addEventListener("click", restart);

restartButton.disabled = true;

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const card = document.createElement("div");
    card.classList.add(color);
    card.addEventListener("click", handleCardClick);
    gameBoard.append(card);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.className;
  flipped.push(card);
  card.removeEventListener("click", handleCardClick);
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundColor = "";
  card.addEventListener("click", handleCardClick);
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(event) {
  let card = event.target;

  if (flipped.length === 2) {
    return;
  } else {
    flipCard(card);
  }

  if (flipped.length === 2) {
    let card1 = flipped[0];
    let card2 = flipped[1];
    if (card1.className === card2.className) {
      flipped = [];
      attempts++;
      document.querySelector("#attempts").textContent = attempts;
      gameStatus.textContent = "You matched " + card1.className;

      matchCounter++;
      if (matchCounter === 5) {
        if (attempts < bestScore) {
          bestScore = attempts;
          document.querySelector("#bestScore").textContent = bestScore;
        }
        restartButton.disabled = false;
        gameStatus.textContent = "You matched all the cards! Press restart to play again."
      }

    } else {
      attempts++;
      document.querySelector("#attempts").textContent = attempts;
      setTimeout(function() {
        flipped = [];
        unFlipCard(card1);
        unFlipCard(card2);
      }, FOUND_MATCH_WAIT_MSECS);
    }
  }
}

function start() {
  createCards(colors);
  startButton.disabled = true;
}

function restart() {
  restartButton.disabled = true;
  matchCounter = 0;
  attempts = 0;
  document.querySelector("#attempts").textContent = attempts;

  const gameBoard = document.getElementById("game");
  gameBoard.innerHTML = "";

  const colors = shuffle(COLORS);
  createCards(colors);

  gameStatus.textContent = "";
}