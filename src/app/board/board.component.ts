import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';

import { Square } from '../models/square.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  isXToPlay = true;
  emptyValue = '';
  winner = '';
  boardSize: number = 0;
  rowCount: number = 0;
  boardArray: Square[] = [];
  winnerColor = '';
  isCPUToPlay = true;
  playerNumber: number = 1;
  
  constructor(private gameService: GameService) {
    this.getGameValues();
  }

  getGameValues() {
    let sources = [
      this.gameService.getBoardSize(),
      this.gameService.getPlayerNumber(), 
      this.gameService.getWinnerColor()
    ];

    combineLatest(sources).subscribe((results: any) => {
      this.boardSize = results[0];
      this.playerNumber = results[1];
      this.winnerColor = results[2];
      this.rowCount = Math.sqrt(this.boardSize);
      this.newGame();
    });
  }

  createBoard(size: number): Square[]{
    let board: Square[] = [];
    for( let i = 0; i < size; i ++ ){
      board.push(new Square(i));
    };
    return board;
  }

  newGame() {
    this.winner = '';
    this.isXToPlay = true;
    this.isCPUToPlay = true;
    this.boardArray = this.createBoard(this.boardSize);
  }

  getGridStyle() {
    return {
      'grid-template-columns': `repeat(${this.rowCount}, 1fr)`
    };
  }

  checkBoardFull(): boolean {
    return this.boardArray.find(square => square.state === this.emptyValue) ? false : true;
  }

  /***
   * 
    3 x 3

    0 1 2
    3 4 5
    6 7 8

    4 x 4

    0   1   2   3 
    4   5   6   7 
    8   9   10  11
    12  13  14  15

    5 x 5

    0  1  2  3  4
    5  6  7  8  9
    10 11 12 13 14
    15 16 17 18 19
    20 21 22 23 24
  */
  checkEndGame(): boolean {

    const firstSquare = this.boardArray[0];

    /* Check horizontal lines */
    if (this.hasEqualLines()) {
      return true;
    }

    /* Check vertical lines */
    if (this.hasEqualColumns()) {
      return true;
    }

    /* Check diagonal lines */
    if (this.hasEqualDiagonals(this.boardSize, this.rowCount, firstSquare)) {
      return true;
    }

    if (this.checkBoardFull()) {
      this.winner = 'Tie!';
      return true;
    }

    return false;
  }

  hasEqualLines(): boolean {
    for (let i = 0; i < this.boardSize; i += this.rowCount) {
      let line = this.boardArray.slice(i, i + this.rowCount);
      let allEqual = line.every(val => val.state && val.state === line[0].state);
      if (allEqual) {
        this.applyWinnerSquareChanges(line);
        return true;
      }
    }
    return false;
  }

  hasEqualColumns(): boolean {
    const columnNumber = this.rowCount * (this.rowCount - 1);
    for (let i = 0; i < this.rowCount; i ++) {
      let line: Square[] = [];
      for (let j = i; j <= i + columnNumber; j += this.rowCount){
        line.push(this.boardArray[j]);
      }
      let allEqual = line.every(val => val.state && val.state === line[0].state);
      if (allEqual) {
        this.applyWinnerSquareChanges(line);
        return true;
      }
    }
    return false;
  }

  hasEqualDiagonals(boardSize: number, rowCount: number, firstSquare: any): boolean {
    let firstDiagonalArray: any = [];
    for (let i = 0; i < boardSize; i += rowCount+1) {
      firstDiagonalArray.push(this.boardArray[i]);
    }

    let secondDiagonalArray: any = [];
    for (let i = rowCount - 1; i < boardSize - rowCount + 1; i += rowCount-1) {
      secondDiagonalArray.push(this.boardArray[i]);
    }

    let isDiagonalEqual = firstDiagonalArray.every((val: { state: any; }) => val.state && val.state === firstSquare.state);
    if (isDiagonalEqual) {
      this.applyWinnerSquareChanges(firstDiagonalArray);
      return true;
    }

    let isSecondDiagonalEqual = secondDiagonalArray.every((val: { state: any; }) => val.state && val.state === secondDiagonalArray[0].state);
    if (isSecondDiagonalEqual) {
      this.applyWinnerSquareChanges(secondDiagonalArray);
      return true;
    }

    return false;
  }

  squareClick(square: any) {
    if (this.boardArray[square.id].state !== this.emptyValue || this.winner !== '') {
      return;
    }

    this.boardArray[square.id].state = this.isXToPlay ? 'X': '0';
    this.isXToPlay = !this.isXToPlay;
    if (this.checkEndGame()) {
      this.isCPUToPlay = true;
      return;
    }

    this.checkAutomaticPlay();
  }

  checkAutomaticPlay() {
    if (this.playerNumber < 2 && this.isCPUToPlay) {
      this.automaticPlay();
    }
    else {
      this.isCPUToPlay = true;
    }
  }

  automaticPlay() {
    let availableArray = this.boardArray.filter((square) => square.state === this.emptyValue);
    let random = Math.floor(Math.random() * availableArray.length);
    this.isCPUToPlay = false;
    this.squareClick(availableArray[random]);
  }

  applyWinnerSquareChanges(squareArray: Square[]) {
    this.winner = squareArray[0].state;
    squareArray.forEach(square => {
      this.boardArray[square.id].background = this.winnerColor;
    });
  }
}
