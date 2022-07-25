// Write a function to check status of tic-tac-toe game
// Ref: what is tic-tac-toe game: https://en.wikipedia.org/wiki/Tic-tac-toe
// In summary, tic-tac-toe game has 9 cells divided into 3 rows of 3 cells.
// Each cell can have 3 values: either X, O or empty.
// We say X is win if there are 3 'X' in either horizontal, vertical or diagonal row.
// The same to O.
// If 9 cells is full of values but no one win, then the game is ended.
//
// Given an array of 9 items: [a0, a1, ..., a7, a8] represent for the tic-tac-toe game cells value:
// |  a0  | a1  | a2  |
// |  a3  | a4  | a5  |
// |  a6  | a7  | a8  |
// Each item will receive either of 3 values: empty, X or O.
// Return an object includes two keys:
// - `status`: a string indicate status of the game. It can be one of the following values:
//    - 'X': if X is win
//    - `O`: if O is win
//    - 'END': if game is ended and no one win
//    - 'PLAYING': if no one is win and game is not ended yet.
//
// - `winPositions`:
//    - If X or O is win, return indexes of the 3 winning marks(X/O).
//    - Return empty array.
//
// Example:
// Input array: cellValues = ['X', 'O', 'O', '', 'X', '', '', 'O', 'X']; represent for
// |  X  | O  | O  |
// |     | X  |    |
// |     | O  | X  |
// -----
// ANSWER:
// {
//    status: 'X',
//    winPositions: [0, 4, 8],
// }
//

import { GAME_STATUS, TURN } from './constants.js';
import { getCellElementAtIdx, getCellElementList } from './selectors.js';

// Input: an array of 9 items
// Output: an object as mentioned above
export function checkGameStatus(cellValues, index) {
  // Write your code here ...
  // Please feel free to add more helper function if you want.
  // It's not required to write everything just in this function.
  const winCases = [
    [0, 3, 6],
    [2, 5, 8],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winCases.length; i++) {
    const winIndexList = winCases[i];
    if (winIndexList.includes(index)) {
      const matchFirstValue =
        getCellElementAtIdx(winIndexList[0]).dataset.value === cellValues ||
        winIndexList[0] === index;
      const matchSecondValue =
        getCellElementAtIdx(winIndexList[1]).dataset.value === cellValues ||
        winIndexList[1] === index;
      const matchThirdValue =
        getCellElementAtIdx(winIndexList[2]).dataset.value === cellValues ||
        winIndexList[2] === index;

      if (matchFirstValue && matchSecondValue && matchThirdValue)
        return {
          status:
            cellValues === TURN.CROSS ? GAME_STATUS.X_WIN : GAME_STATUS.O_WIN,
          winPositions: winIndexList,
        };
    }
  }

  const cellElementList = getCellElementList();
  let count = 0;
  for (let i = 0; i < cellElementList.length; i++) {
    if (cellElementList[i].dataset.value !== undefined) count++;
  }

  if (count === 8)
    return {
      status: GAME_STATUS.ENDED,
      winPositions: [],
    };

  return {
    status: GAME_STATUS.PLAYING,
    winPositions: [],
  };
}
