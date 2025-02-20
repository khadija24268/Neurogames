// Components/RandomSym.js
import Symbols from './Symbols';

class RandomSym {
  constructor() {
    this.symbolsBank = [
      '!',
      '@',
      '#',
      '%',
      // '^',
      '&',
      // '*',
      '(',
      ')',
      '<',
      '>',
      '?',
      '/',
      '|',
      '§',
      '}',
      '{',
      ']',
      '[',
      '~',
      // '`',
      // '_',
      '=',
      '+',
      '-',
    ];
    this.symbols = [];
    this.displaySymbols = [];
    this.initialize();
  }

  initialize() {
    this.symbols = [];
    let randList = [...this.symbolsBank];
    randList.sort(() => Math.random() - 0.5);
    for (let i = 1; i < 6; i++) {
      this.symbols.push(new Symbols(randList[i], i.toString()));
    }
    this.shuffled();
  }

  shuffled() {
    let shuffleSymbols = [...this.symbols];
    this.displaySymbols = [];
    while (shuffleSymbols.length > 0) {
      shuffleSymbols.sort(() => Math.random() - 0.5);
      this.displaySymbols.push(shuffleSymbols.pop());
    }
  }
}

export default RandomSym;
