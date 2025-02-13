import { Injectable } from "@angular/core";
import { HttpService } from "../http/http.service";
import { Words } from "../http/http.types";
import { Progress, Result } from "./words.types";

@Injectable({
	providedIn: "root",
})
export class WordService {
	cache: Words | null = null;
	context = "unknown";
	http: HttpService;

	constructor(http: HttpService) {
		this.http = http;
	}

	get progress(): Progress | null {
		const progress = localStorage.getItem(this.context);

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

		if (progress.guesses[0].length < 5) {
			progress.guesses[0] += letter;
			this.setProgress(progress);
		}
	}

	enterGuess(): void {
		const progress = this.progress;

		if (progress === null || this.cache === null) {
			return;
		}

		const guess = progress.guesses[0];

		if (!this.cache.guessable.includes(guess) && !this.cache.solutions.includes(guess)) {
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
		if (this.cache !== null) {
			return;
		}

		const response = await this.http.getWords();

		if ("message" in response) {
			return;
		}

		this.cache = response.data;
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
		if (this.cache === null) {
			return;
		}

		const index = Math.floor(Math.random() * this.cache.solutions.length);
		const solution = this.cache.solutions[index];

		this.setProgress({ guesses: [""], result: Result.None, solution });
	}

	setProgress(progress: Progress): void {
		localStorage.setItem(this.context, JSON.stringify(progress));
	}
}
