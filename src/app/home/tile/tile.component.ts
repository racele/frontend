import { Component, Input, booleanAttribute } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "../../../http/http.service";

@Component({
	selector: "app-tile",
	styleUrl: "./tile.component.css",
	templateUrl: "./tile.component.html",
})
export class TileComponent {
	http: HttpService;
	router: Router;

	@Input({ required: true })
	route = "";

	@Input({ transform: booleanAttribute })
	unlocked = false;

	constructor(http: HttpService, router: Router) {
		this.http = http;
		this.router = router;
	}

	get active(): boolean {
		return this.http.loggedIn || this.unlocked;
	}

	onclick(): void {
		if (this.active) {
			this.router.navigateByUrl(this.route);
		} else {
			alert("Login required!");
		}
	}
}
