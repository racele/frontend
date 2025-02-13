export interface Progress {
	guesses: string[];
	result: Result;
	solution: string;
}

export enum Result {
	Loss = 0,
	None = 1,
	Victory = 2,
}
