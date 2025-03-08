import { Injectable } from "@angular/core";
import { HttpService } from "../http/http.service";
import { Daily, Score, Words } from "../http/http.types";
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
			return { date: null, guesses: [""], solution: null, state: State.Initial, time: {} };
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
		this.applyScore();
	}

	applyScore(): void {
		if (this.progress.state !== State.Victory) {
			return;
		}

		if (this.progress.time.start === undefined || this.progress.time.end === undefined) {
			throw new Error("start or end time is undefined");
		}

		const score = {
			attempts: this.progress.guesses.length - 1,
			time: this.progress.time.end - this.progress.time.start,
		} as Score;

		if (this.mode === Mode.Daily) {
			score.date = this.daily?.date;
			this.http.setScore(score);
		} else {
			this.http.setScore(score);
		}
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

		this.words = response;
	}

	async loadDaily(): Promise<void> {
		const response = await this.http.getDaily();

		if ("message" in response) {
			throw new TypeError();
		}

		this.daily = response;

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
			date = this.daily.date;
			solution = this.daily.solution;
		}

		if (this.mode === Mode.Practice && this.words !== null) {
			solution = this.words.solutions[Math.floor(Math.random() * this.words.solutions.length)];
		}

		if (this.progress.state === State.Running) {
			this.last = this.progress;
		}

		this.setProgress({ date, guesses, solution, state: State.Initial, time: {} });
	}

	setProgress(progress: Progress): void {
		localStorage.setItem(this.mode, JSON.stringify(progress));
	}
}
