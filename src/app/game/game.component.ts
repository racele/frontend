import {
	AfterViewInit,
	Component,
	HostListener,
	OnInit,
	QueryList,
	ViewChildren,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WordService } from "../../words/words.service";
import { Mode, State } from "../../words/words.types";
import { WordComponent } from "./word/word.component";

@Component({
	imports: [WordComponent],
	selector: "app-game",
	styleUrl: "./game.component.css",
	templateUrl: "./game.component.html",
})
export class GameComponent implements AfterViewInit, OnInit {
	route: ActivatedRoute;
	words: WordService;

	@ViewChildren(WordComponent)
	grid!: QueryList<WordComponent>;

	constructor(route: ActivatedRoute, words: WordService) {
		this.route = route;
		this.words = words;
	}

	get day() {
		const format = new Intl.DateTimeFormat(undefined, {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});

		if (this.words.last !== null && this.words.last.date !== null) {
			return format.format(new Date(this.words.last.date));
		}

		if (this.words.progress.date !== null) {
			return format.format(new Date(this.words.progress.date));
		}

		return "Unknown";
	}

	get initial(): boolean {
		return this.words.progress.state === State.Initial && this.words.last === null;
	}

	get practice(): boolean {
		return this.words.mode === Mode.Practice;
	}

	async ngAfterViewInit(): Promise<void> {
		this.updateWords();

		try {
			await this.words.load();
		} catch {
			alert("Could not load word list!");
		}

		if (this.initial || this.words.last !== null) {
			this.reset();
		}
	}

	ngOnInit(): void {
		this.route.data.subscribe((data) => {
			this.words.mode = data.mode;
		});
	}

	@HostListener("window:keydown", ["$event"])
	onkeydown(event: KeyboardEvent): void {
		const key = event.key.toLowerCase();

		if (/^[a-z]$/.test(key)) {
			this.words.addLetter(key);
		} else if (key === "backspace") {
			this.words.removeLetter();
		} else if (key === "delete" && this.practice) {
			this.reset();
		} else if (key === "enter") {
			this.words.enterGuess();

			if (this.words.progress.state === State.Loss) {
				setTimeout(alert, 0, `The solution was: ${this.words.progress.solution?.toUpperCase()}`);
			} else if (this.words.progress.state === State.Victory) {
				setTimeout(alert, 0, "Your time: 0:00.000");
			}
		}

		this.updateWords();
	}

	reset(): void {
		this.words.reset();

		if (this.words.last !== null) {
			alert(`The solution was: ${this.words.last.solution?.toUpperCase()}`);
			this.words.last = null;
		}

		this.updateWords();
	}

	updateWords(): void {
		const progress = this.words.progress;

		for (const word of this.grid) {
			const guess = progress.guesses.pop() ?? "";
			const entered = progress.guesses.length > 0;

			word.setWord(guess, entered, progress.solution);
		}
	}
}
