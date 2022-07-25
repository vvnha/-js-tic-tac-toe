import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
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

function handleCellClick(cell, index) {
  // set selected cell
  const isSelected =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);

  if (isSelected) return;

  cellValues[index] =
    currentTurn === 'cross' ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;
  const result = checkGameStatus(cellValues);
  const replayButtonElement = getReplayButtonElement();
  isGameEnded =
    result.status === GAME_STATUS.ENDED ||
    result.status === GAME_STATUS.O_WIN ||
    result.status === GAME_STATUS.X_WIN;

  if (isGameEnded && replayButtonElement) {
    replayButtonElement.style.display = 'inline-block';
  }

  const statusElement = getGameStatusElement();

  if (statusElement) {
    statusElement.textContent = result.status;
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

  cellElementList.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
  });
}

function initReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  const cellElementList = getCellElementList();
  if (!cellElementList || !cellElementList) return;

  replayButtonElement.addEventListener('click', () => {
    cellValues = new Array(9).fill('');
    cellElementList.forEach((cell) => {
      cell.classList.remove(TURN.CROSS, TURN.CIRCLE);
    });

    replayButtonElement.style.display = 'none';
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
