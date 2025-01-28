import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
	imports: [RouterLink],
	selector: "app-tile",
	styleUrl: "./tile.component.css",
	templateUrl: "./tile.component.html",
})
export class TileComponent {
	@Input()
	link = "";
}
