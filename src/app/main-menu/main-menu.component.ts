import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent  implements OnInit {

  playerNumber: number = 1;
  public currentLanguage: string = '';
  
  constructor(private gameService: GameService) { }

  ngOnInit() {
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
