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
		let index = 0;

		for (const span of this.spans) {
			const letter = guess[index] ?? "";

			span.nativeElement.innerHTML = letter.toUpperCase();

			if (solution === null || !entered) {
				span.nativeElement.className = "";
			} else if (letter === solution[index]) {
				span.nativeElement.className = "green";
			} else if (solution.includes(letter)) {
				span.nativeElement.className = "yellow";
			} else {
				span.nativeElement.className = "gray";
			}

			index++;
		}
	}
}
