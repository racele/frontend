import { Component } from "@angular/core";
import { TileComponent } from "./tile/tile.component";

@Component({
	imports: [TileComponent],
	selector: "app-home",
	styleUrl: "./home.component.css",
	templateUrl: "./home.component.html",
})
export class HomeComponent {}
