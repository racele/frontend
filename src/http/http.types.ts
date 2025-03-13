export interface Auth {
	token: string;
}

export interface Daily {
	date: string;
	language: string;
	solution: string;
}

export interface HttpError {
	code: number;
	message: string;
}

export enum HttpMethod {
	Get = "GET",
	Post = "POST",
}

export interface Score {
	date: string | null;
	guesses: number;
	solution: string;
	time: number;
}

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
