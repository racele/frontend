import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	OnInit,
	QueryList,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WordService } from "../../words/words.service";
import { Mode, Result } from "../../words/words.types";
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

	@ViewChild("button")
	button!: ElementRef<HTMLButtonElement>;

	@ViewChildren(WordComponent)
	grid!: QueryList<WordComponent>;

	@ViewChild("info")
	info!: ElementRef<HTMLSpanElement>;

	constructor(route: ActivatedRoute, words: WordService) {
		this.route = route;
		this.words = words;
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

		if (this.words.progress === null) {
			this.words.reset();
		}

		this.updateWords();
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
			this.words.reset();
		} else if (key === "enter") {
			this.words.enterGuess();

			if (this.words.progress?.result === Result.Loss) {
				setTimeout(alert, 0, `The solution was: ${this.words.progress.solution.toUpperCase()}`);
			} else if (this.words.progress?.result === Result.Victory) {
				setTimeout(alert, 0, "Your time: 0:00.000");
			}
		}

		this.updateWords();
	}

	reset(): void {
		this.words.reset();
		this.updateWords();
	}

	updateWords(): void {
		const progress = this.words.progress;

		if (progress === null) {
			return;
		}

		if (progress.guesses.length > 1) {
			this.info.nativeElement.className = "hidden";

			if (this.practice) {
				this.button.nativeElement.disabled = false;
			}
		} else {
			this.info.nativeElement.className = "";

			if (this.practice) {
				this.button.nativeElement.disabled = true;
			}
		}

		for (const word of this.grid) {
			const guess = progress.guesses.pop() ?? "";
			const entered = progress.guesses.length > 0;

			word.setWord(guess, entered, progress.solution);
		}
	}
}
