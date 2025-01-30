import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "../../http/http.service";

@Component({
	selector: "app-logout",
	styleUrl: "./logout.component.css",
	templateUrl: "./logout.component.html",
})
export class LogoutComponent {
	http: HttpService;
	router: Router;

	constructor(http: HttpService, router: Router) {
		this.http = http;
		this.router = router;
	}

	cancel() {
		alert("Logout cancelled");
		this.router.navigateByUrl("");
	}

	confirm() {
		this.http.removeToken();

		alert("Logout successful");
		this.router.navigateByUrl("");
	}
}
