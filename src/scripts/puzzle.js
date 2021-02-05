import Cell from './cell';

export default class Puzzle {
  constructor(el) {
    this.parentEl = el;
    this.arrImg = [];

    for (let i = 0; i < 20; i += 1) {
      const rand = Math.floor(1 + Math.random() * (150 - 1));
      const image = `https://raw.githubusercontent.com/irinainina/image-data/master/box/${rand}.jpg`;
      this.arrImg.push(image);
    }

    this.indexImage = 0;
    this.imageSrc = this.arrImg[this.indexImage];
    this.width = 40;
    this.height = 40;
    this.dimmension = 4;
    this.cells = [];
    this.shuffling = false;

    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'relative';
    this.wrapper.style.margin = ' 0 auto';

    this.outputTime = document.createElement('div');
    this.min = 0;
    this.sec = 0;
    this.steps = document.createElement('div');
    this.stepCounter = 0;
    this.soundOnOff = true;
    this.choiseDimm = 0;
    this.openMenu = false;

    this.btnBestScores = document.createElement('div');
  }

  MenuInit() {
    const menuElem = document.createElement('div');
    menuElem.classList.add('menu');
    document.body.prepend(menuElem);

    const btnMenu = document.createElement('div');
    btnMenu.classList.add('btnMenu', 'btns', 'topMenu');
    btnMenu.innerText = 'Меню';
    this.createTime(menuElem);
    menuElem.append(btnMenu);

    const divMenu = document.createElement('div');
    divMenu.classList.add('divMenu');
    this.parentEl.append(divMenu);
    divMenu.style.visibility = 'hidden';
    divMenu.style.opacity = '0';
    this.btnNewGame(divMenu);
    this.btnSaveGame(divMenu);
    this.btnLoadGame(divMenu);
    this.btnChoiseDimmension(divMenu);
    this.soundBtn(divMenu);
    this.bestScores(divMenu);

    btnMenu.addEventListener('click', () => {
      this.openMenu = !this.openMenu;
      if (this.openMenu) {
        btnMenu.textContent = 'Вернуться к игре';
        divMenu.style.visibility = 'visible';
        divMenu.style.width = `${this.width}rem`;
        divMenu.style.height = `${this.height}rem`;
        setTimeout(() => {
          divMenu.style.opacity = '.8';
        }, 0);
      } else {
        divMenu.style.opacity = '0';
        divMenu.style.visibility = 'hidden';
        btnMenu.textContent = 'Меню';
      }
    });
    this.stepsOutput(menuElem);
  }

  btnNewGame(menu) {
    const btnNewGame = document.createElement('div');
    btnNewGame.classList.add('btns');
    menu.append(btnNewGame);
    btnNewGame.innerText = 'Новая игра';

    btnNewGame.addEventListener('click', () => {
      const cell = document.querySelectorAll('.cell');
      cell.forEach((e) => {
        e.remove();
      });
      this.cells.length = 0;
      this.setup();
      this.restartGame();
    });
  }

  restartGame() {
    this.stepCounter = 0;
    this.stepsUp();
    this.restartTime();
  }

  btnSaveGame(menu) {
    const btnSaveGame = document.createElement('div');
    btnSaveGame.classList.add('btns');
    menu.append(btnSaveGame);
    btnSaveGame.innerText = 'Сохранить игру';

    btnSaveGame.addEventListener('click', () => {
      this.saveGame();
    });
  }

  btnLoadGame(menu) {
    const btnLoadGame = document.createElement('div');
    btnLoadGame.classList.add('btns');
    menu.append(btnLoadGame);
    btnLoadGame.innerText = 'Загрузить игру';

    btnLoadGame.addEventListener('click', () => {
      this.getSaveGame();
    });
  }

  saveGame() {
    let indexCells = '';
    const arr = [];
    for (let k = 0; k < this.cells.length; k += 1) {
      arr.push(this.cells[k].index);
      indexCells = arr.join(',');
    }

    const img = this.imageSrc;
    const min = `${this.min}`;
    const sec = `${this.sec}`;
    const steps = `${this.stepCounter}`;
    const dimmension = `${this.dimmension}`;
    const position = indexCells;

    const save = {
      img,
      min,
      sec,
      steps,
      dimmension,
      position,
    };

    localStorage.setItem('save', JSON.stringify(save));
  }

  getSaveGame() {
    const {
      img, min, sec, steps, dimmension, position,
    } = JSON.parse(localStorage.getItem('save'));

    this.min = +min;
    this.sec = +sec;
    this.stepCounter = +steps;
    this.stepsUp();
    const cell = document.querySelectorAll('.cell');
    cell.forEach((e) => {
      e.remove();
    });
    this.cells.length = 0;
    this.dimmension = +dimmension;
    this.setup();
    this.imageSrc = img;

    const arr = position.split(',');

    for (let i = 0; i < this.cells.length; i += 1) {
      this.cells[i].width = this.width / this.dimmension;
      this.cells[i].height = this.height / this.dimmension;
      this.cells[i].setIndex(+arr[i]);
      this.cells[i].setImage();
      if (+arr[i] !== this.cells.length - 1) {
        this.cells[i].isEmpty = false;
        this.cells[i].el.style.opacity = '1';
      } else {
        this.findEmpty();
        this.cells[i].isEmpty = true;
        this.cells[i].el.style.opacity = '0';
      }
    }
  }

  btnChoiseDimmension(menu) {
    const choiseDimmension = document.createElement('div');
    choiseDimmension.classList.add('btns', 'disable');
    menu.append(choiseDimmension);
    choiseDimmension.innerText = 'Размер поля:';

    const choise = document.createElement('div');
    choise.classList.add('choise');
    menu.append(choise);
    choise.style.display = 'flex';

    for (let i = 0; i < 6; i += 1) {
      const div = document.createElement('div');
      div.classList.add('dimm', 'btns');
      choise.append(div);

      const divValue = i + 3;
      const textDimmension = `${divValue} x ${divValue}`;
      div.innerText = textDimmension;
      div.style.display = 'flex';

      div.addEventListener('click', () => {
        const cell = document.querySelectorAll('.cell');
        cell.forEach((e) => {
          e.remove();
        });
        this.cells.length = 0;
        this.dimmension = divValue;
        this.setup();
        this.restartGame();
      });
    }
  }

  createTime(menu) {
    this.outputTime.classList.add('time', 'btns', 'disable', 'topMenu');
    menu.append(this.outputTime);
    this.showTime();
  }

  restartTime() {
    this.min = 0;
    this.sec = 0;
  }

  showTime() {
    const time = () => {
      this.sec += 1;
      this.sec = +this.sec;

      if (this.sec === 60) {
        this.sec = 0;
        this.min += 1;
        this.min = +this.min;
      }
      let second = this.sec;
      let minutes = this.min;

      if (this.sec < 10) {
        second = `0${this.sec}`;
      }
      if (this.min < 10) {
        minutes = `0${this.min}`;
      }
      this.outputTime.innerText = `Время ${minutes}:${second}`;

      setTimeout(time, 1000);
    };

    time();
  }

  soundBtn(menu) {
    const soundBtn = document.createElement('div');
    soundBtn.classList.add('soundBtn', 'btns');
    menu.append(soundBtn);
    soundBtn.innerText = 'Звук';
    soundBtn.addEventListener('click', () => {
      this.toggleSound();
      if (this.soundOnOff) {
        soundBtn.style.textDecoration = 'none';
      } else {
        soundBtn.style.textDecoration = 'line-through';
      }
    });
  }

  setBestScores() {
    if (!this.shuffling && this.isAssembled()) {
      const arr = JSON.parse(localStorage.getItem('arr')) || [];
      if (arr.length < 10) {
        arr.push(this.stepCounter);
        arr.sort();
        localStorage.removeItem('arr');
        localStorage.setItem('arr', JSON.stringify(arr));
      } else if (arr.length === 10) {
        arr.pop();
        arr.push(this.stepCounter);
        arr.sort();
        localStorage.removeItem('arr');
        localStorage.setItem('arr', JSON.stringify(arr));
      } else if (arr.length > 10) {
        arr.length = 10;
        localStorage.removeItem('arr');
        localStorage.setItem('arr', JSON.stringify(arr));
      }
    }
  }

  bestScores(menu) {
    this.btnBestScores.classList.add('btns');
    menu.append(this.btnBestScores);
    this.btnBestScores.innerText = 'Топ 10';

    const bestScores = document.createElement('div');
    bestScores.classList.add('bestScores');
    document.body.prepend(bestScores);

    const closeScoreBtn = document.createElement('div');
    closeScoreBtn.classList.add('closeScoreBtn');
    bestScores.append(closeScoreBtn);
    closeScoreBtn.innerText = 'Закрыть';

    const lastResult = document.createElement('div');
    bestScores.append(lastResult);
    lastResult.classList.add('lastResult');
    let msgOfLastResult = '';
    if (localStorage.getItem('lastResult') == null) {
      msgOfLastResult = '(будет после победы)';
    } else {
      msgOfLastResult = localStorage.getItem('lastResult');
    }
    lastResult.innerText = `Ваш последний результат - ${msgOfLastResult}`;

    const table = document.createElement('div');
    table.classList.add('table');
    bestScores.append(table);

    const places = document.createElement('div');
    places.classList.add('places');
    table.append(places);
    const p = document.createElement('p');
    places.append(p);
    p.innerText = 'Место';

    for (let i = 0; i < 10; i += 1) {
      const num = document.createElement('p');
      places.append(num);
      num.innerText = `${i + 1}`;
    }

    const countStep = document.createElement('div');
    countStep.classList.add('countStep');
    table.append(countStep);
    const title = document.createElement('p');
    countStep.append(title);
    title.innerText = 'Количество ходов';

    if (JSON.parse(localStorage.getItem('arr')) !== null && JSON.parse(localStorage.getItem('arr')) !== undefined) {
      const arr = JSON.parse(localStorage.getItem('arr') || []);
      for (let i = 0; i < arr.length; i += 1) {
        const count = document.createElement('p');
        countStep.append(count);
        count.innerText = arr[i];
      }
    }

    bestScores.style.transition = 'opacity .3s';
    bestScores.style.visibility = 'hidden';
    bestScores.style.opacity = '0';
    bestScores.style.width = '100vw';
    bestScores.style.height = '100vh';

    this.btnBestScores.addEventListener('click', () => {
      bestScores.style.visibility = 'visible';
      bestScores.style.opacity = '1';

      closeScoreBtn.addEventListener('click', () => {
        bestScores.style.opacity = '0';
        setTimeout(() => {
          bestScores.style.visibility = 'hidden';
        }, 300);
      });
    });
  }

  toggleSound() {
    this.soundOnOff = !this.soundOnOff;
  }

  sound() {
    const audioElement = document.createElement('audio');
    audioElement.src = 'paper.mp3';
    if (this.soundOnOff) {
      audioElement.play();
    }
  }

  stepsOutput(menu) {
    this.steps.classList.add('steps', 'btns', 'disable', 'topMenu');
    menu.append(this.steps);
    this.steps.innerText = `Ходы: ${this.stepCounter}`;
  }

  stepsUp() {
    this.steps.textContent = `Ходы: ${this.stepCounter}`;
  }

  msg() {
    const msg = document.createElement('div');

    document.body.prepend(msg);
    msg.classList.add('msg');
    const p = document.createElement('p');
    msg.append(p);

    p.innerText = `Ура! Вы решили головоломку за ${this.min}мин. ${this.sec}сек. и ${this.stepCounter} ходов`;

    const closeMsgBtn = document.createElement('div');
    msg.append(closeMsgBtn);
    closeMsgBtn.classList.add('closeMsgBtn');
    closeMsgBtn.innerText = 'Закрыть';

    msg.style.visibility = 'visible';
    msg.style.opacity = '1';

    closeMsgBtn.addEventListener('click', () => {
      msg.style.opacity = '0';
      msg.style.visibility = 'hidden';
      localStorage.setItem('lastResult', JSON.stringify(this.stepCounter));
      this.setBestScores();
    });
  }

  init() {
    this.el = this.wrapper;
    this.parentEl.append(this.el);
  }

  setup() {
    const img = document.createElement('img');

    if (this.indexImage === 19) {
      this.indexImage = 0;
    }
    this.indexImage += 1;
    this.imageSrc = this.arrImg[this.indexImage];

    img.src = this.imageSrc;
    img.onload = () => {
      this.el.style.width = `${this.width}rem`;
      this.el.style.height = `${this.height}rem`;
    };

    for (let i = 0; i < (this.dimmension * this.dimmension); i += 1) {
      this.cells.push(new Cell(this, i));
    }
    this.shuffle();
  }

  shuffle() {
    this.shuffling = true;
    for (let i = (this.cells.length - 1); i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      this.swapCells(i, j);
    }
    this.shuffling = false;
    this.isSolvable();
  }

  isSolvable() {
    let inversePairs = 0;
    let empty = 0;
    for (let i = 1; i < this.cells.length; i += 1) {
      for (let j = i + 1; j < this.cells.length; j += 1) {
        if (this.cells[i].index > this.cells[j].index) {
          inversePairs += 1;
        }
      }
      if (this.cells[i].index === this.cells.length - 1) {
        empty = parseInt((i / this.dimmension), 10) + 1;
      }
    }
    if (this.dimmension % 2) {
      if (inversePairs % 2) {
        this.shuffle();
      }
    } else if ((inversePairs + empty) % 2) {
      this.shuffle();
    }
  }

  swapCells(i, j, animate) {
    this.cells[i].setPosition(j, animate, i);
    this.cells[j].setPosition(i);
    [this.cells[i], this.cells[j]] = [this.cells[j], this.cells[i]];
    if (!this.shuffling && this.isAssembled()) {
      this.msg();
    }
  }

  isAssembled() {
    for (let i = 0; i < this.cells.length - 1; i += 1) {
      if (i !== this.cells[i].index) {
        return false;
      }
    }
    return true;
  }

  findPosition(ind) {
    return this.cells.findIndex((cell) => cell.index === ind);
  }

  findEmpty() {
    return this.cells.findIndex((cell) => cell.isEmpty);
  }
}
