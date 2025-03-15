import { Injectable } from "@angular/core";
import { HttpClient } from "./http.client";
import { Auth, Daily, Query, Score, User, Words } from "./http.types";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	client: HttpClient;

	constructor() {
		this.client = new HttpClient();
	}

	get loggedIn(): boolean {
		return this.client.token !== null;
	}

	authorizeUser(username: string, password: string): Promise<Auth> {
		return this.client.post("/users/authorize", { password, username });
	}

	createScore(guesses: number, solution: string, time: number, date?: string): Promise<Score> {
		const query: Query = {
			guesses: guesses.toString(),
			solution,
			time: time.toString(),
		};

		if (date !== undefined) {
			query.date = date;
		}

		return this.client.post("/users/@me/scores", query);
	}

	createUser(username: string, password: string): Promise<User> {
		return this.client.post("/users", { password, username });
	}

	getDaily(): Promise<Daily> {
		return this.client.get("/words/daily", { language: "en" });
	}

	getWords(): Promise<Words> {
		return this.client.get("/words", { language: "en" });
	}

	listDaily(): Promise<Score[]> {
		return this.client.get("/users/@me/scores/daily", {});
	}

	listPractice(): Promise<Score[]> {
		return this.client.get("/users/@me/scores/practice", {});
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
