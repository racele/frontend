export interface Auth {
	token: string;
}

export interface Daily {
	date: string;
	language: string;
	solution: string;
}

export interface Error {
	code: number;
	message: string;
}

export enum HttpMethod {
	Get = "GET",
	Post = "POST",
}

export type HttpResponse<T> = Promise<Error | T>;

export type Strings = Record<string, string>;

export interface User {
	created_at: number;
	id: number;
	username: string;
}

export interface Words {
	guessable: string[];
	solutions: string[];
}
