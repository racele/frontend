import { Component } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent {
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];
  keyColors: Record<string, string> = {};

  constructor() {
    // Initialize all key colors to a default, e.g., 'white'
    this.initKeyboard();
  }
  updateKeyboard(guesses: string[]): void {
    guesses.forEach(guess => {
      guess.toUpperCase().split('').forEach(letter => {
        if (this.keyColors[letter] !== undefined) {
          this.keyColors[letter] = '#666'; // or any other logic to determine the color
        }
      });
    });
  }
  initKeyboard(): void {
    this.keyboardRows.forEach(row => {
      row.forEach(key => {
        this.keyColors[key] = '#bbb';
      });
    });
  }
}