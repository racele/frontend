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
			await this.http.authorizeUser(this.password, this.remember, this.username);

			alert("Login successful!");
			this.router.navigateByUrl("");
		} catch (error) {
			if (error instanceof TypeError) {
				alert(`${error.message}!`);
			}
		}
	}

	async register(): Promise<void> {
		try {
			await this.http.createUser(this.password, this.username);
			await this.login();
		} catch (error) {
			if (error instanceof TypeError) {
				alert(`${error.message}!`);
			}
		}
	}
}
