export interface Auth {
	token: string;
}

export interface ErrorResponse {
	code: number;
	message: string;
}

export enum HttpMethod {
	Get = "GET",
	Post = "POST",
}

export type HttpResponse<T> = Promise<ErrorResponse | SuccessResponse<T>>;

export type Strings = Record<string, string>;

export interface SuccessResponse<T> {
	code: number;
	data: T;
}

export interface User {
	created_at: number;
	id: number;
	username: string;
}
