export class GameOptions {

    id: number;
    title: string;
    isSelected: boolean;
  
    constructor(id: number, title: string, isSelected: boolean) {
      this.id = id;
      this.title = title;
      this.isSelected = isSelected;
    }
}