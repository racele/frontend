import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { HttpService } from "../http/http.service";

@Component({
	imports: [RouterLink, RouterOutlet],
	selector: "app-root",
	styleUrl: "./app.component.css",
	templateUrl: "./app.component.html",
})
export class AppComponent {
	http: HttpService;

	get dark(): boolean {
		return localStorage.getItem("dark") !== null;
	}

	constructor(http: HttpService) {
		this.http = http;
	}

	toggleMode(): void {
		if (this.dark) {
			localStorage.removeItem("dark");
		} else {
			localStorage.setItem("dark", "");
		}
	}
}
