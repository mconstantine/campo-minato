const grid = document.getElementById("grid");
const playButton = document.getElementById("play");
const levelSelect = document.getElementById("level");
const scoreSpan = document.getElementById("score");

let bombIndexes = [];
let isGameOver = false;
let score = 0;

playButton.addEventListener("click", function () {
  setupGrid();
});

function setupGrid() {
  resetScore();

  isGameOver = false;
  grid.classList.remove("easy", "medium", "hard");
  bombIndexes = [];
  grid.innerHTML = "";

  let cellsCount = 100,
    levelCSSClass = "easy";

  switch (levelSelect.value) {
    case "HARD":
      cellsCount = 49;
      levelCSSClass = "hard";
      break;

    case "MEDIUM":
      cellsCount = 81;
      levelCSSClass = "medium";
      break;

    case "EASY":
    default:
      cellsCount = 100;
      levelCSSClass = "easy";
      break;
  }

  bombIndexes = generateBombsArray(cellsCount);
  grid.classList.add(levelCSSClass);

  for (let i = 0; i < cellsCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }

  const cellElements = document.querySelectorAll(".cell");

  for (let i = 0; i < cellElements.length; i++) {
    cellElements[i].addEventListener("click", function () {
      onCellClick(this, i, cellElements);
    });
  }

  return cellElements;
}

function onCellClick(element, index, cellElements) {
  if (isGameOver) {
    return;
  }

  if (isBomb(index)) {
    isGameOver = true;
    revealPlayground(cellElements);
  } else {
    const bombsCount = getBombsCount(index, cellElements);

    element.classList.add("clicked");
    element.innerHTML = bombsCount;

    increaseScore();
  }
}

function getBombsCount(cellIndex, cellElements) {
  const cellsPerRow = Math.sqrt(cellElements.length);
  const adjacentCellIndexes = [];
  const hasCellsOnLeft = cellIndex % cellsPerRow !== 0;
  const hasCellsOnRight = cellIndex % cellsPerRow !== cellsPerRow - 1;
  const hasCellsOnTop = cellIndex > cellsPerRow;
  const hasCellsOnBottom = cellIndex + cellsPerRow < cellElements.length;

  if (hasCellsOnLeft) {
    adjacentCellIndexes.push(cellIndex - 1);
  }

  if (hasCellsOnRight) {
    adjacentCellIndexes.push(cellIndex + 1);
  }

  if (hasCellsOnTop) {
    adjacentCellIndexes.push(cellIndex - cellsPerRow);
  }

  if (hasCellsOnBottom) {
    adjacentCellIndexes.push(cellIndex + cellsPerRow);
  }

  if (hasCellsOnTop && hasCellsOnLeft) {
    adjacentCellIndexes.push(cellIndex - cellsPerRow - 1);
  }

  if (hasCellsOnTop && hasCellsOnRight) {
    adjacentCellIndexes.push(cellIndex - cellsPerRow + 1);
  }

  if (hasCellsOnBottom && hasCellsOnLeft) {
    adjacentCellIndexes.push(cellIndex + cellsPerRow - 1);
  }

  if (hasCellsOnBottom && hasCellsOnRight) {
    adjacentCellIndexes.push(cellIndex + cellsPerRow + 1);
  }

  let bombsCount = 0;

  for (let i = 0; i < adjacentCellIndexes.length; i++) {
    const adjacentCellIndex = adjacentCellIndexes[i];

    if (bombIndexes.includes(adjacentCellIndex)) {
      bombsCount++;
    }
  }

  return bombsCount;
}

function isBomb(index) {
  return bombIndexes.includes(index);
}

function increaseScore() {
  score++;
  scoreSpan.innerHTML = score;
}

function resetScore() {
  score = 0;
  scoreSpan.innerHTML = 0;
}

function generateBombsArray(cellsCount) {
  let result = [];

  while (result.length < 16) {
    const bombIndex = getRandomNumber(1, cellsCount);

    if (!result.includes(bombIndex)) {
      result.push(bombIndex);
    }
  }

  return result;
}

function getRandomNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function revealPlayground(cellElements) {
  for (let i = 0; i < cellElements.length; i++) {
    const element = cellElements[i];
    const bombsCount = getBombsCount(i, cellElements);

    if (isBomb(i)) {
      element.classList.add("clicked", "bomb");
    } else {
      element.classList.add("clicked");
      element.innerHTML = bombsCount;
    }
  }
}
