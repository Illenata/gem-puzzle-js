export default class Cell {
  constructor(puzzle, ind) {
    this.isEmpty = false;
    this.index = ind;
    this.puzzle = puzzle;
    this.width = this.puzzle.width / this.puzzle.dimmension;
    this.height = this.puzzle.height / this.puzzle.dimmension;

    this.el = this.createDiv();
    puzzle.el.appendChild(this.el);

    if (this.index === (this.puzzle.dimmension * this.puzzle.dimmension) - 1) {
      this.isEmpty = true;
      return;
    }
    this.setImage();
    this.setPosition(this.index);
  }

  setIndex(n) {
    this.index = n;
  }

  createDiv() {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.style.backgroundSize = `${this.puzzle.width}rem ${this.puzzle.height}rem`;
    div.style.opacity = '0';
    setTimeout(() => {
      div.style.opacity = '1';
      if (this.index === (this.puzzle.dimmension * this.puzzle.dimmension) - 1) {
        this.isEmpty = true;
        div.style.opacity = '0';
      }
    }, 300);

    div.onclick = () => {
      const currentCellIndex = this.puzzle.findPosition(this.index);
      const emptyCellIndex = this.puzzle.findEmpty();
      const { x, y } = this.getXY(currentCellIndex);
      const { x: emptyX, y: emptyY } = this.getXY(emptyCellIndex);
      if ((x === emptyX || y === emptyY)
          && (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1)) {
        this.puzzle.sound();
        this.puzzle.stepCounter += 1;
        this.puzzle.stepsUp();
        this.puzzle.swapCells(currentCellIndex, emptyCellIndex, true);
      }
    };

    div.setAttribute('draggable', 'true');

    div.addEventListener('dragstart', () => {
      setTimeout(() => {
        div.style.visibility = 'hidden';
      }, 0);
    });

    div.addEventListener('dragend', () => {
      const currentCellIndex = this.puzzle.findPosition(this.index);
      const emptyCellIndex = this.puzzle.findEmpty();
      const { x, y } = this.getXY(currentCellIndex);
      const { x: emptyX, y: emptyY } = this.getXY(emptyCellIndex);
      div.style.visibility = 'visible';
      if ((x === emptyX || y === emptyY)
            && (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1)) {
        this.puzzle.sound();
        this.puzzle.stepCounter += 1;
        this.puzzle.stepsUp();
        this.puzzle.swapCells(currentCellIndex, emptyCellIndex, false);
      }
    });

    this.puzzle.el.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    return div;
  }

  setImage() {
    const { x, y } = this.getXY(this.index);
    const left = this.width * x;
    const top = this.height * y;

    this.el.style.width = `${this.width}rem`;
    this.el.style.height = `${this.height}rem`;

    this.el.style.backgroundImage = `url(${this.puzzle.imageSrc})`;
    this.el.style.backgroundPosition = `-${left}rem -${top}rem`;
  }

  setPosition(destinationIndex, animate, currentIndex) {
    const { left, top } = this.getPositionFromIndex(destinationIndex);
    const { left: currentLeft, top: currentTop } = this.getPositionFromIndex(currentIndex);

    if (animate) {
      if (left !== currentLeft) {
        this.animate('left', currentLeft, left);
      } else if (top !== currentTop) {
        this.animate('top', currentTop, top);
      }
    } else {
      this.el.style.left = `${left}rem`;
      this.el.style.top = `${top}rem`;
    }
  }

  animate(position, currentPosition, destination) {
    const animationDuration = 200;
    const frameRate = 10;
    const step = (frameRate * (Math.abs(destination - currentPosition))) / animationDuration;

    const id = setInterval(() => {
      if (currentPosition < destination) {
        // eslint-disable-next-line no-param-reassign
        currentPosition = Math.min(destination, currentPosition + step);
        if (currentPosition >= destination) {
          clearInterval(id);
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        currentPosition = Math.max(destination, currentPosition - step);
        if (currentPosition <= destination) {
          clearInterval(id);
        }
      }

      this.el.style[position] = `${currentPosition}rem`;
    }, frameRate);
  }

  getPositionFromIndex(index) {
    const { x, y } = this.getXY(index);
    return {
      left: this.width * x,
      top: this.height * y,
    };
  }

  getXY(index) {
    return {
      x: index % this.puzzle.dimmension,
      y: Math.floor(index / this.puzzle.dimmension),
    };
  }
}
