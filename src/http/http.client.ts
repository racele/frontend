import { HttpError, HttpMethod, Query } from "./http.types";

export class HttpClient {
	get token(): string | null {
		return localStorage.getItem("token") ?? sessionStorage.getItem("token");
	}

	get<T>(path: string, query: Query): Promise<T> {
		return this.request(HttpMethod.Get, path, query);
	}

	post<T>(path: string, query: Query): Promise<T> {
		return this.request(HttpMethod.Post, path, query);
	}

	async request<T>(method: HttpMethod, path: string, query: Query): Promise<T> {
		const body = new URLSearchParams(query);
		const headers = new Headers();
		const url = new URL(path, "http://localhost:3000");

		if (this.token !== null) {
			headers.set("Authorization", `Bearer ${this.token}`);
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
}
