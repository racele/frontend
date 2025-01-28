import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
	imports: [FormsModule],
	selector: "app-login",
	styleUrl: "./login.component.css",
	templateUrl: "./login.component.html",
})
export class LoginComponent {
	password = "";
	remember = false;
	username = "";

	login() {
		this.verify();
	}

	register() {
		this.verify();
	}

	verify() {
		if (!/^[a-zA-Z]{3,}$/.test(this.username)) {
			alert("Invalid username!");
			return;
		}

		if (!/^[a-zA-Z0-9]{8,}$/.test(this.password)) {
			alert("Invalid password!");
			return;
		}

		alert(`Valid: ${this.username}, ${this.password}, ${this.remember}`);
	}
}
