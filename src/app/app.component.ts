import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { HttpService } from "../http/http.service";
import { User } from "../http/http.types";

@Component({
	imports: [FormsModule, RouterLink, RouterOutlet],
	selector: "app-root",
	styleUrl: "./app.component.css",
	templateUrl: "./app.component.html",
})
export class AppComponent {
	http: HttpService;
	query = "";

	searched = false;
	users: User[] = [];

	get dark(): boolean {
		return localStorage.getItem("dark") !== null;
	}

	constructor(http: HttpService, router: Router) {
		this.http = http;

		router.events.subscribe(() => {
			this.query = "";
			this.searchUsers();
		});
	}

	async searchUsers(): Promise<void> {
		const query = this.query.trim();

		if (query === "") {
			this.searched = false;
		} else {
			try {
				this.users = await this.http.searchUsers(this.query);
				this.searched = true;
			} catch {
				alert("Could not search users!");
			}
		}
	}

	toggleMode(): void {
		if (this.dark) {
			localStorage.removeItem("dark");
		} else {
			localStorage.setItem("dark", "");
		}
	}
}
