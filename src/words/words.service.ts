import { Injectable } from "@angular/core";
import { HttpService } from "../http/http.service";
import { Daily, Words } from "../http/http.types";
import { Mode, Progress, State } from "./words.types";

@Injectable({
	providedIn: "root",
})
export class WordService {
	http: HttpService;
	mode = Mode.Unknown;

	daily: Daily | null = null;
	last: Progress | null = null;
	words: Words | null = null;

	constructor(http: HttpService) {
		this.http = http;
	}

	get progress(): Progress {
		const progress = localStorage.getItem(this.mode);

		if (progress === null) {
			return { date: null, guesses: [""], solution: null, state: State.Initial };
		}

		return JSON.parse(progress);
	}

	addLetter(letter: string): void {
		const progress = this.progress;

		if (progress.state === State.Loss || progress.state === State.Victory) {
			return;
		}

		progress.guesses[0] = (progress.guesses[0] + letter).slice(0, 5);
		this.setProgress(progress);
	}

	enterGuess(): void {
		const progress = this.progress;
		const guess = progress.guesses[0];

		if (!this.words?.guessable.includes(guess) && !this.words?.solutions.includes(guess)) {
			return;
		}

		if (guess === progress.solution) {
			progress.state = State.Victory;
		} else if (progress.guesses.length === 1) {
			progress.state = State.Running;
		} else if (progress.guesses.length === 6) {
			progress.state = State.Loss;
		}

		progress.guesses.unshift("");
		this.setProgress(progress);
	}

	async load(): Promise<void> {
		if (this.mode === Mode.Daily) {
			await this.loadDaily();
		}

		if (this.words !== null) {
			return;
		}

		const response = await this.http.getWords();

		if ("message" in response) {
			throw new TypeError();
		}

		this.words = response.data;
	}

	async loadDaily(): Promise<void> {
		const response = await this.http.getDaily();

		if ("message" in response) {
			throw new TypeError();
		}

		this.daily = response.data;

		if (this.daily.solution !== this.progress?.solution) {
			this.reset();
		}
	}

	removeLetter(): void {
		const progress = this.progress;

		if (progress.state === State.Loss || progress.state === State.Victory) {
			return;
		}

		progress.guesses[0] = progress.guesses[0].slice(0, -1);
		this.setProgress(progress);
	}

	reset(): void {
		let date: string | null = null;
		let guesses = [""];
		let solution: string | null = null;

		if (this.progress.state === State.Initial) {
			guesses = this.progress.guesses;
		}

		if (this.mode === Mode.Daily && this.daily !== null) {
			date = this.daily.created_at;
			solution = this.daily.solution;
		}

		if (this.mode === Mode.Practice && this.words !== null) {
			solution = this.words.solutions[Math.floor(Math.random() * this.words.solutions.length)];
		}

		if (this.progress.state === State.Running) {
			this.last = this.progress;
		}

		this.setProgress({ date, guesses, solution, state: State.Initial });
	}

	setProgress(progress: Progress): void {
		localStorage.setItem(this.mode, JSON.stringify(progress));
	}
}
