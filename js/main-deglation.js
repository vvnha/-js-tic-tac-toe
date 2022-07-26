import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
  getUlCellElement,
} from './selectors.js';

import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import { checkGameStatus } from './utils.js';

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill('');

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
}
function updateGameStatus(status) {
  const statusElement = getGameStatusElement();

  if (statusElement) {
    statusElement.textContent = status;
  }
}

function showReplayButton() {
  const replayButtonElement = getReplayButtonElement();

  if (isGameEnded && replayButtonElement) {
    // replayButtonElement.style.display = 'inline-block';
    replayButtonElement.classList.add('show');
  }
}

function highlightWinCells(winIndexList) {
  if (!Array.isArray(winIndexList) && winIndexList.length !== 3) return;

  for (let i = 0; i < winIndexList.length; i++) {
    const cellElement = getCellElementAtIdx(winIndexList[i]);
    cellElement.classList.add('win');
  }
}

function handleCellClick(cell, index) {
  // set selected cell
  const isSelected =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);

  if (isSelected || isGameEnded) return;

  cellValues[index] =
    currentTurn === 'cross' ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;
  const result = checkGameStatus(cellValues);

  switch (result.status) {
    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN:
      isGameEnded = true;
      updateGameStatus(result.status);
      showReplayButton();
      highlightWinCells(result.winPositions);
      break;

    case GAME_STATUS.ENDED:
      isGameEnded = true;
      updateGameStatus(result.status);
      showReplayButton();
      break;

    default:
      break;
  }

  const currentTurnElement = getCurrentTurnElement();

  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(
      currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE
    );
  }

  cell.classList.add(currentTurn);
  // change current turn
  toggleTurn();
}

function initCellElementList() {
  const cellElementList = getCellElementList();

  // add data-idx
  cellElementList.forEach((cell, index) => {
    cell.dataset.idx = index;
    // cell.addEventListener('click', () => handleCellClick(cell, index));
  });

  // add Listener with deglation
  const ulListener = getUlCellElement();

  if (!ulListener) return;

  ulListener.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;

    const index = event.target.dataset.idx;
    handleCellClick(event.target, index);
  });
}

function initReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  const cellElementList = getCellElementList();
  if (!cellElementList || !cellElementList) return;

  replayButtonElement.addEventListener('click', () => {
    currentTurn = TURN.CROSS;
    updateGameStatus(GAME_STATUS.PLAYING);
    cellValues = cellValues.map(() => '');
    isGameEnded = false;

    const currentTurnElement = getCurrentTurnElement();

    if (currentTurnElement) {
      currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
      currentTurnElement.classList.add(TURN.CROSS);
    }

    cellElementList.forEach((cell) => {
      cell.classList.remove(TURN.CROSS, TURN.CIRCLE, 'win');
    });

    replayButtonElement.classList.remove('show');
  });
}

(() => {
  //bind click even for all element
  initCellElementList();
  //bind click even for replay button
  initReplayButton();
  //...
})();

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
