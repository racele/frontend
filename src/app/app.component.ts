import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
	imports: [RouterLink, RouterOutlet],
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent {}
