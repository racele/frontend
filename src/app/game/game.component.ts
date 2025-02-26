import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	OnInit,
	QueryList,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WordService } from "../../words/words.service";
import { Mode, State } from "../../words/words.types";
import { KeyboardComponent } from "./keyboard/keyboard.component";
import { WordComponent } from "./word/word.component";

@Component({
	imports: [KeyboardComponent, WordComponent],
	selector: "app-game",
	styleUrl: "./game.component.css",
	templateUrl: "./game.component.html",
})
export class GameComponent implements AfterViewInit, OnDestroy, OnInit {
	interval: number;
	route: ActivatedRoute;
	words: WordService;

	@ViewChildren(WordComponent)
	grid!: QueryList<WordComponent>;

	@ViewChild(KeyboardComponent)
	keyboard!: KeyboardComponent;

	@ViewChild("timer")
	timer!: ElementRef<HTMLTimeElement>;

	constructor(route: ActivatedRoute, words: WordService) {
		this.route = route;
		this.words = words;

		this.interval = setInterval(() => {
			this.timer.nativeElement.innerHTML = this.time;
		});
	}

	get day(): string {
		const format = new Intl.DateTimeFormat(undefined, {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});

		const date = this.words.last?.date ?? this.words.progress.date;

		if (date === null) {
			return "Unknown";
		}

		return format.format(new Date(date));
	}

	get initial(): boolean {
		return this.words.progress.state === State.Initial;
	}

	get practice(): boolean {
		return this.words.mode === Mode.Practice;
	}

	get time(): string {
		const format = new Intl.DateTimeFormat(undefined, {
			fractionalSecondDigits: 3,
			minute: "2-digit",
			second: "2-digit",
		});

		const max = 60 * 60 * 1000 - 1;
		const now = Date.now();

		const end = this.words.progress.time.end ?? now;
		const start = this.words.progress.time.start ?? now;
		const time = Math.min(max, end - start);

		return format.format(time);
	}

	async ngAfterViewInit(): Promise<void> {
		this.update();

		try {
			await this.words.load();
		} catch {
			alert("Could not load word list!");
		}

		if (this.initial) {
			this.reset();
		}
	}

	ngOnDestroy(): void {
		clearInterval(this.interval);
	}

	ngOnInit(): void {
		this.route.data.subscribe((data) => {
			this.words.mode = data.mode;
		});
	}

	@HostListener("window:keydown", ["$event.key"])
	onkeydown(input: string): void {
		const key = input.toLowerCase();

		if (/^[a-z]$/.test(key)) {
			this.words.addLetter(key);
		} else if (key === "backspace") {
			this.words.removeLetter();
		} else if (key === "delete" && this.practice) {
			this.reset();
		} else if (key === "enter") {
			this.words.enterGuess();

			if (this.words.progress.state === State.Loss) {
				setTimeout(alert, 20, `The solution was: ${this.words.progress.solution?.toUpperCase()}`);
			} else if (this.words.progress.state === State.Victory) {
				setTimeout(alert, 20, `Congratulations! Your time: ${this.time}`);
			}
		}

		this.update();
	}

	reset(): void {
		this.words.reset();

		if (this.words.last !== null) {
			alert(`The solution was: ${this.words.last.solution?.toUpperCase()}`);
			this.words.last = null;
		}

		this.update();
	}

	update(): void {
		const progress = this.words.progress;

		for (const word of this.grid) {
			const guess = progress.guesses.pop() ?? "";
			const entered = progress.guesses.length > 0;

			word.setWord(guess, entered, progress.solution);
		}

		this.keyboard.update();
	}
}
