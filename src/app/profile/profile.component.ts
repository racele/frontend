import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "../../http/http.service";
import { Session } from "../../http/http.types";

@Component({
	imports: [FormsModule],
	selector: "app-profile",
	styleUrl: "./profile.component.css",
	templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
	http: HttpService;
	router: Router;

	password = "";
	sessions: Session[] = [];
	username = "";

	constructor(http: HttpService, router: Router) {
		this.http = http;
		this.router = router;
	}

	async deleteSession(id: number): Promise<void> {
		try {
			await this.http.deleteSession(id);

			alert("Session deleted!");
			await this.ngOnInit();
		} catch {
			alert("Could not delete session!");
		}
	}

	formatTimestamp(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleString(undefined, {
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			month: "2-digit",
			second: "2-digit",
			year: "numeric",
		});
	}

	async ngOnInit(): Promise<void> {
		try {
			this.sessions = await this.http.listSessions();
		} catch {
			this.sessions = [];
		}
	}

	async update(): Promise<void> {
		const password = this.password.trim();
		const username = this.username.trim();

		if (password === "" && username === "") {
			alert("Nothing to update!");
			return;
		}

		try {
			if (this.password === "") {
				await this.http.updateUser(undefined, username);
			} else if (this.username === "") {
				await this.http.updateUser(password, undefined);
			} else {
				await this.http.updateUser(password, username);
			}

			alert("Update successful!");
		} catch (error) {
			if (error instanceof TypeError) {
				alert(`${error.message}!`);
			}
		}
	}
}
