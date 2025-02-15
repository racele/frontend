import { Injectable } from "@angular/core";
import { HttpClient } from "./http.client";
import { Auth, Daily, HttpResponse, User, Words } from "./http.types";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	client: HttpClient;

	constructor() {
		this.client = new HttpClient();
	}

	get loggedIn() {
		return this.client.token !== null;
	}

	authorizeUser(username: string, password: string): HttpResponse<Auth> {
		return this.client.post("users/authorize", { password, username });
	}

	createUser(username: string, password: string): HttpResponse<User> {
		return this.client.post("users", { password, username });
	}

	getDaily(): HttpResponse<Daily> {
		return this.client.get("words/daily", { language: "en" });
	}

	getWords(): HttpResponse<Words> {
		return this.client.get("words", { language: "en" });
	}

	removeToken(): void {
		localStorage.removeItem("token");
		sessionStorage.removeItem("token");
	}

	setToken(token: string, remember: boolean): void {
		this.removeToken();

		if (remember) {
			localStorage.setItem("token", token);
		} else {
			sessionStorage.setItem("token", token);
		}
	}
}
