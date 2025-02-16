import { Component, ElementRef, QueryList, ViewChildren } from "@angular/core";

@Component({
	selector: "app-word",
	styleUrl: "./word.component.css",
	templateUrl: "./word.component.html",
})
export class WordComponent {
	@ViewChildren("span")
	spans!: QueryList<ElementRef<HTMLSpanElement>>;

	setWord(guess: string, entered: boolean, solution: string | null): void {
		const classes = Array(5).fill("");
		const letters = Array.from(guess);

		if (entered && solution !== null) {
			const letters = Array.from(solution);

			for (let i = 0; i < guess.length; i++) {
				if (guess[i] === solution[i]) {
					classes[i] = "green";
					letters[i] = "";
				} else {
					classes[i] = "gray";
				}
			}

			for (let i = 0; i < guess.length; i++) {
				if (classes[i] === "gray" && letters.includes(guess[i])) {
					classes[i] = "yellow";
					letters[letters.indexOf(guess[i])] = "";
				}
			}
		}

		for (const span of this.spans) {
			const letter = letters.shift() ?? "";

			span.nativeElement.className = classes.shift();
			span.nativeElement.innerHTML = letter.toUpperCase();
		}
	}
}
