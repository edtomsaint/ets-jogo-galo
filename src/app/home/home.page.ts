import { Component } from '@angular/core';

import { GameService } from '../game.service';
import { merge, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  playerNumber: number = 1;
  public currentLanguage: string = '';

  constructor(private gameService: GameService) {
    this.getData();
  }

  getData() {
    this.gameService.getPlayerNumber().subscribe((players: number) => {
      this.playerNumber = players;
    });
    this.gameService.getCurrentLanguage().subscribe((language: string) => {
      this.languageOptionClicked(language);
    });
  }

  playersOptionClicked(playerNumber: number) {
    this.gameService.setPlayerNumber(playerNumber);
    this.playerNumber = playerNumber;
  }

  languageOptionClicked(languageSelected: string) {
    this.currentLanguage = languageSelected;
    this.gameService.setCurrentLanguage(languageSelected);
  }
}
