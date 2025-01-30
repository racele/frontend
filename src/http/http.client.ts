import { HttpMethod, HttpResponse, Strings } from "./http.types";

export class HttpClient {
	get token(): string | null {
		return localStorage.getItem("token") ?? sessionStorage.getItem("token");
	}

	get<T>(route: string, values: Strings): HttpResponse<T> {
		return this.request(HttpMethod.Get, route, values);
	}

	post<T>(route: string, values: Strings): HttpResponse<T> {
		return this.request(HttpMethod.Post, route, values);
	}

	async request<T>(method: HttpMethod, route: string, values: Strings): HttpResponse<T> {
		const body = new URLSearchParams(values);
		const headers = new Headers();
		const url = new URL(route, "http://localhost:3000");

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

		return response.json();
	}
}
