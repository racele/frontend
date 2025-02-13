import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	QueryList,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import { WordService } from "../../words/words.service";
import { Result } from "../../words/words.types";
import { WordComponent } from "./word/word.component";

@Component({
	imports: [WordComponent],
	selector: "app-practice",
	styleUrl: "./practice.component.css",
	templateUrl: "./practice.component.html",
})
export class PracticeComponent implements AfterViewInit {
	words: WordService;

	@ViewChild("button")
	button!: ElementRef<HTMLButtonElement>;

	@ViewChildren(WordComponent)
	grid!: QueryList<WordComponent>;

	@ViewChild("info")
	info!: ElementRef<HTMLSpanElement>;

	constructor(words: WordService) {
		this.words = words;
		this.words.context = "practice";
	}

	async ngAfterViewInit(): Promise<void> {
		this.updateWords();

		try {
			await this.words.load();
		} catch {
			alert("Could not fetch word list!");
		}

		if (this.words.progress === null) {
			this.words.reset();
		}
	}

	@HostListener("window:keydown", ["$event"])
	onkeydown(event: KeyboardEvent): void {
		const key = event.key.toLowerCase();

		if (/^[a-zA-Z]$/.test(key)) {
			this.words.addLetter(key);
		} else if (key === "backspace") {
			this.words.removeLetter();
		} else if (key === "delete") {
			this.reset();
		} else if (key === "enter") {
			this.words.enterGuess();

			if (this.words.progress?.result === Result.Loss) {
				const solution = this.words.progress.solution.toUpperCase();
				setTimeout(alert, 0, `You lost! The solution was: ${solution}`);
			} else if (this.words.progress?.result === Result.Victory) {
				setTimeout(alert, 0, "You won! Your time: 0:00.000");
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
			this.info.nativeElement.classList.add("hidden");
			this.button.nativeElement.disabled = false;
		} else {
			this.info.nativeElement.classList.remove("hidden");
			this.button.nativeElement.disabled = true;
		}

		for (const word of this.grid) {
			const guess = progress.guesses.pop() ?? "";
			const entered = progress.guesses.length > 0;

			word.setWord(guess, entered, progress.solution);
		}
	}
}
