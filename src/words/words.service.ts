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

	get default(): Progress {
		return {
			date: null,
			guesses: [""],
			posted: false,
			solution: null,
			state: State.Initial,
			time: {},
		};
	}

	get progress(): Progress {
		const progress = localStorage.getItem(this.mode);

		if (progress === null) {
			return this.default;
		}

		return JSON.parse(progress);
	}

	get time(): number {
		const max = 60 * 60 * 1000 - 1;
		const now = Date.now();

		const end = this.progress.time.end ?? now;
		const start = this.progress.time.start ?? now;

		return Math.min(end - start, max);
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

		const now = Date.now();

		progress.state = State.Running;
		progress.time.start ??= now;

		if (guess === progress.solution) {
			progress.state = State.Victory;
			progress.time.end = now;
		} else if (progress.guesses.length === 6) {
			progress.state = State.Loss;
			progress.time.end = now;
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

		this.words = await this.http.getWords("en");
	}

	async loadDaily(): Promise<void> {
		this.daily = await this.http.getDaily("en");

		if (this.daily.solution !== this.progress?.solution) {
			this.reset();
		}
	}

	async postScore(): Promise<void> {
		const progress = this.progress;

		if (!this.http.loggedIn || progress.posted || progress.solution === null || progress.state !== State.Victory) {
			return;
		}

		const guesses = progress.guesses.length - 1;

		if (this.mode === Mode.Daily) {
			await this.http.createScore(guesses, progress.solution, this.time, this.daily?.date);
		} else {
			await this.http.createScore(guesses, progress.solution, this.time);
		}

		progress.posted = true;
		this.setProgress(progress);
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
		const progress = this.default;

		if (this.progress.state === State.Initial) {
			progress.guesses = this.progress.guesses;
		}

		if (this.mode === Mode.Daily && this.daily !== null) {
			progress.date = this.daily.date;
			progress.solution = this.daily.solution;
		}

		if (this.mode === Mode.Practice && this.words !== null) {
			progress.solution = this.words.solutions[Math.floor(Math.random() * this.words.solutions.length)];
		}

		if (this.progress.state === State.Running) {
			this.last = this.progress;
		}

		this.setProgress(progress);
	}

	setProgress(progress: Progress): void {
		localStorage.setItem(this.mode, JSON.stringify(progress));
	}
}
