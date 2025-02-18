import { Component, EventEmitter, Output } from "@angular/core";
import { WordService } from "../../../words/words.service";

@Component({
	selector: "app-keyboard",
	styleUrl: "./keyboard.component.css",
	templateUrl: "./keyboard.component.html",
})
export class KeyboardComponent {
	@Output()
	button = new EventEmitter<string>();

	colors: Record<string, string> = {};
	words: WordService;

	rows = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Enter", "Z", "X", "C", "V", "B", "N", "M", "\u232b"],
	];

	constructor(words: WordService) {
		this.words = words;
	}

	classes(key: string): string[] {
		const classes = [];
		const lower = key.toLowerCase();

		if (key === "Enter" || key === "\u232b") {
			classes.push("big");
		}

		if (lower in this.colors) {
			classes.push(this.colors[lower]);
		}

		return classes;
	}

	onclick(key: string): void {
		if (key === "\u232b") {
			this.button.emit("Backspace");
		} else {
			this.button.emit(key);
		}
	}

	update(): void {
		this.colors = {};

		if (this.words.progress.solution === null) {
			return;
		}

		for (const guess of this.words.progress.guesses.slice(1)) {
			for (let i = 0; i < guess.length; i++) {
				this.updateLetter(i, guess[i], this.words.progress.solution);
			}
		}
	}

	updateLetter(index: number, letter: string, solution: string): void {
		if (letter === solution[index]) {
			this.colors[letter] = "green";
			return;
		}

		if (solution.includes(letter) && this.colors[letter] !== "green") {
			this.colors[letter] = "yellow";
			return;
		}

		if (letter in this.colors) {
			return;
		}

		this.colors[letter] = "gray";
	}
}
