import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
} from './selectors.js';

import { GAME_STATUS, TURN } from './constants.js';
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

function getCellValues(currentTurn, index) {
  const cellElementList = getCellElementList();
  const cellElementAtIndex = getCellElementAtIdx(index);

  if (!cellElementAtIndex) return;

  cellElementAtIndex.dataset.value = currentTurn === 'cross' ? 'X' : 'O';

  const cellElementValueList = [];

  for (let i = 0; i < cellElementList.length; i++) {
    const cell = cellElementList[i];
    const cellValue = (cell.dataset.value ??= '');

    cellElementValueList.push(cellValue);
  }

  return cellElementValueList;
}

function handleCellClick(cell, index) {
  // set selected cell
  const isSelected =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);

  if (isSelected) return;

  const cellValues = getCellValues(currentTurn, index);
  const result = checkGameStatus(cellValues);
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

(() => {
  //bind click even for all element
  initCellElementList();
  //bind click even for replay button
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
