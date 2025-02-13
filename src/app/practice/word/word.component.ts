import { Component, ElementRef, QueryList, ViewChildren } from "@angular/core";

@Component({
	selector: "app-word",
	styleUrl: "./word.component.css",
	templateUrl: "./word.component.html",
})
export class WordComponent {
	@ViewChildren("span")
	spans!: QueryList<ElementRef<HTMLSpanElement>>;

	setWord(guess: string, entered: boolean, solution: string): void {
		let index = 0;

		for (const span of this.spans) {
			const letter = guess[index] ?? "";

			span.nativeElement.className = "";
			span.nativeElement.innerHTML = letter.toUpperCase();

			if (entered) {
				if (letter === solution[index]) {
					span.nativeElement.classList.add("green");
				} else if (solution.includes(letter)) {
					span.nativeElement.classList.add("yellow");
				} else {
					span.nativeElement.classList.add("gray");
				}
			}

			index++;
		}
	}
}
