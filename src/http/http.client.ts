import { Auth, HttpError, HttpMethod, Query } from "./http.types";

export class HttpClient {
	get auth(): Auth | null {
		const auth = localStorage.getItem("auth") ?? sessionStorage.getItem("auth");

		if (auth === null) {
			return null;
		}

		return JSON.parse(auth);
	}

	delete<T>(path: string, query: Query): Promise<T> {
		return this.request(HttpMethod.Delete, path, query);
	}

	get<T>(path: string, query: Query): Promise<T> {
		return this.request(HttpMethod.Get, path, query);
	}

	patch<T>(path: string, query: Query): Promise<T> {
		return this.request(HttpMethod.Patch, path, query);
	}

	post<T>(path: string, query: Query): Promise<T> {
		return this.request(HttpMethod.Post, path, query);
	}

	put<T>(path: string, query: Query): Promise<T> {
		return this.request(HttpMethod.Put, path, query);
	}

	removeAuth(): void {
		localStorage.removeItem("auth");
		sessionStorage.removeItem("auth");
	}

	async request<T>(method: HttpMethod, path: string, query: Query): Promise<T> {
		const body = new URLSearchParams(query);
		const headers = new Headers();
		const url = new URL(path, "http://localhost:3000");

		if (this.auth !== null) {
			headers.set("Authorization", `Bearer ${this.auth.token}`);
		}

		let response: Response;

		if (method === HttpMethod.Get) {
			url.search = body.toString();
			response = await fetch(url, { headers, method });
		} else {
			response = await fetch(url, { body, headers, method });
		}

		const parsed: T | HttpError = await response.json();

		if (typeof parsed === "object" && parsed !== null && "message" in parsed) {
			throw new TypeError(parsed.message);
		}

		return parsed;
	}

	setAuth(auth: Auth, remember: boolean): void {
		this.removeAuth();

		if (remember) {
			localStorage.setItem("auth", JSON.stringify(auth));
		} else {
			sessionStorage.setItem("auth", JSON.stringify(auth));
		}
	}
}
