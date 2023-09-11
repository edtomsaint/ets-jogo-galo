import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private playerNumber: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private boardSize: BehaviorSubject<number> = new BehaviorSubject<number>(9);
  private winnerColor: BehaviorSubject<string> = new BehaviorSubject<string>('#a3d7a3');

  constructor(private readonly translate: TranslateService,
              private readonly storage: StorageService) { 
  }

  getPlayerNumber(): Observable<number> {
    return this.playerNumber.asObservable();
  }

  setPlayerNumber(playerNumber: number): void {
    this.playerNumber.next(playerNumber);
  }

  getBoardSize(): Observable<number> {
    return this.boardSize.asObservable();
  }

  setBoardSize(boardSize: number): void {
    this.boardSize.next(boardSize);
  }

  getWinnerColor(): Observable<string> {
    return this.winnerColor.asObservable();
  }

  setWinnerColor(winnerColor: string): void {
    this.winnerColor.next(winnerColor);
  }

  getCurrentLanguage(): Observable<string> {
    return new Observable(subscriber => {
      this.storage.get('lang').then(storageLang => {
        if (storageLang) {
          subscriber.next(storageLang);
        }
        else {
          subscriber.next(this.translate.getDefaultLang());
        }
      });
    });
  }

  setCurrentLanguage(language: string): void {
    this.translate.use(language);
    this.storage.set('lang', language);
  }

}