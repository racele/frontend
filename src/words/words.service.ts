import { Injectable } from "@angular/core";
import { HttpService } from "../http/http.service";
import { Words } from "../http/http.types";
import { Mode, Progress, Result } from "./words.types";

@Injectable({
	providedIn: "root",
})
export class WordService {
	http: HttpService;
	mode = Mode.Unknown;

	words: Words | null = null;

	constructor(http: HttpService) {
		this.http = http;
	}

	get progress(): Progress | null {
		const progress = localStorage.getItem(this.mode);

		if (progress === null) {
			return null;
		}

		return JSON.parse(progress);
	}

	addLetter(letter: string): void {
		const progress = this.progress;

		if (progress === null || progress.result !== Result.None) {
			return;
		}

		progress.guesses[0] = (progress.guesses[0] + letter).slice(0, 5);
		this.setProgress(progress);
	}

	enterGuess(): void {
		const progress = this.progress;

		if (progress === null || this.words === null) {
			return;
		}

		const guess = progress.guesses[0];

		if (!this.words.guessable.includes(guess) && !this.words.solutions.includes(guess)) {
			return;
		}

		if (guess === progress.solution) {
			progress.result = Result.Victory;
		} else if (progress.guesses.length === 6) {
			progress.result = Result.Loss;
		}

		progress.guesses.unshift("");
		this.setProgress(progress);
	}

	async load(): Promise<void> {
		if (this.words !== null) {
			return;
		}

		const response = await this.http.getWords();

		if ("message" in response) {
			return;
		}

		this.words = response.data;
	}

	removeLetter(): void {
		const progress = this.progress;

		if (progress === null || progress.result !== Result.None) {
			return;
		}

		progress.guesses[0] = progress.guesses[0].slice(0, -1);
		this.setProgress(progress);
	}

	reset(): void {
		let solution: string;

		if (this.mode === Mode.Practice && this.words !== null) {
			solution = this.words.solutions[Math.floor(Math.random() * this.words.solutions.length)];
		} else {
			return;
		}

		this.setProgress({ guesses: [""], result: Result.None, solution });
	}

	setProgress(progress: Progress): void {
		localStorage.setItem(this.mode, JSON.stringify(progress));
	}
}
