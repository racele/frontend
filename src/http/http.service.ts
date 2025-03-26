import { Injectable } from "@angular/core";
import { HttpClient } from "./http.client";
import { Auth, Daily, Deleted, Query, Request, Score, Session, User, Words } from "./http.types";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	client: HttpClient;

	constructor() {
		this.client = new HttpClient();
	}

	get id(): number | null {
		return this.client.auth?.user_id ?? null;
	}

	get loggedIn(): boolean {
		return this.client.auth !== null;
	}

	acceptRequest(id: number): Promise<Request> {
		return this.client.put(`/users/@me/requests/${id}/accept`, {});
	}

	async authorizeUser(password: string, remember: boolean, username: string): Promise<Auth> {
		const auth: Auth = await this.client.post("/users/authorize", { password, username });

		this.client.setAuth(auth, remember);
		return auth;
	}

	createRequest(id: number): Promise<Request> {
		return this.client.post("/users/@me/requests", { recipient_id: id.toString() });
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

	createUser(password: string, username: string): Promise<User> {
		return this.client.post("/users", { password, username });
	}

	deleteRequest(id: number): Promise<Deleted> {
		return this.client.delete(`/users/@me/requests/${id}`, {});
	}

	deleteSession(id: number): Promise<Deleted> {
		return this.client.delete(`/users/@me/sessions/${id}`, {});
	}

	async endSession(): Promise<Deleted> {
		const deleted: Deleted = await this.client.delete("/users/@me/sessions/@me", {});

		this.client.removeAuth();
		return deleted;
	}

	getDaily(language: string): Promise<Daily> {
		return this.client.get("/words/daily", { language });
	}

	getRequest(id: number): Promise<Request> {
		return this.client.get(`/users/@me/requests/${id}`, {});
	}

	getUser(id: number): Promise<User> {
		return this.client.get(`/users/${id}`, {});
	}

	getWords(language: string): Promise<Words> {
		return this.client.get("/words", { language });
	}

	listRequests(status: string): Promise<Request[]> {
		return this.client.get("/users/@me/requests", { status });
	}

	listScores(mode: string): Promise<Score[]> {
		return this.client.get("/users/@me/scores", { mode });
	}

	listSessions(): Promise<Session[]> {
		return this.client.get("/users/@me/sessions", {});
	}

	searchUsers(query: string): Promise<User[]> {
		return this.client.get("/users", { query });
	}

	updateUser(password?: string, username?: string): Promise<User> {
		const query: Query = {};

		if (password !== undefined) {
			query.password = password;
		}

		if (username !== undefined) {
			query.username = username;
		}

		return this.client.patch("/users/@me", query);
	}
}
