import '../styles/styles.scss';

import Puzzle from './puzzle';

const puzzleWrapper = document.createElement('div');
puzzleWrapper.classList.add('puzzle-wrapper');
document.body.append(puzzleWrapper);

const puzzle = new Puzzle(
  document.querySelector('.puzzle-wrapper'),
);

puzzle.MenuInit();
puzzle.init();
puzzle.setup();
