import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../../http/http.service";
import { User } from "../../http/http.types";

@Component({
	selector: "app-user",
	styleUrl: "./user.component.css",
	templateUrl: "./user.component.html",
})
export class UserComponent {
	http: HttpService;
	user: User | null = null;

	get disabled() {
		return !this.http.loggedIn;
	}

	constructor(http: HttpService, route: ActivatedRoute) {
		this.http = http;

		route.paramMap.subscribe((params) => {
			this.getUser(Number(params.get("id")));
		});
	}

	formatTimestamp(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString(undefined, {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}

	async getUser(id: number): Promise<void> {
		try {
			this.user = await this.http.getUser(id);
		} catch {
			this.user = null;
		}
	}

	async sendRequest(): Promise<void> {
		if (this.user === null) {
			return;
		}

		if (this.disabled) {
			alert("Login required!");
			return;
		}

		try {
			await this.http.createRequest(this.user.id);
			alert("Friend request sent!");
		} catch (error) {
			if (error instanceof TypeError) {
				alert(`${error.message}!`);
			}
		}
	}
}
