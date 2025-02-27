import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "../../http/http.service";

@Component({
	imports: [FormsModule],
	selector: "app-login",
	styleUrl: "./login.component.css",
	templateUrl: "./login.component.html",
})
export class LoginComponent {
	http: HttpService;
	router: Router;

	password = "";
	remember = false;
	username = "";

	constructor(http: HttpService, router: Router) {
		this.http = http;
		this.router = router;
	}

	async login(): Promise<void> {
		try {
			const response = await this.http.authorizeUser(this.username, this.password);

			if ("message" in response) {
				alert(`Error: ${response.message}`);
				return;
			}

			alert("Login successful!");

			this.http.setToken(response.token, this.remember);
			this.router.navigateByUrl("");
		} catch {
			alert("Connection error!");
		}
	}

	async register(): Promise<void> {
		try {
			const response = await this.http.createUser(this.username, this.password);

			if ("message" in response) {
				alert(`Error: ${response.message}`);
				return;
			}

			this.login();
		} catch {
			alert("Connection error!");
		}
	}
}
