export interface Auth {
	token: string;
	user_id: number;
}

export interface Daily {
	date: string;
	language: string;
	solution: string;
}

export interface Deleted {
	deleted: boolean;
}

export interface HttpError {
	message: string;
}

export enum HttpMethod {
	Delete = "DELETE",
	Get = "GET",
	Patch = "PATCH",
	Post = "POST",
	Put = "PUT",
}

export type Query = Record<string, string>;

export interface Request {
	accepted_at: number | null;
	created_at: number;
	recipient_id: number;
	sender_id: number;
}

export interface Score {
	created_at: number;
	date: string | null;
	guesses: number;
	solution: string;
	time: number;
	user_id: number;
}

export interface Session {
	created_at: number;
	last_used_at: number;
	session_id: number;
	user_id: number;
}

export interface User {
	created_at: number;
	user_id: number;
	username: string;
}

export interface Words {
	guessable: string[];
	solutions: string[];
}
