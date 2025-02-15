export enum Mode {
	Daily = "daily",
	Practice = "practice",
	Unknown = "unknown",
}

export interface Progress {
	guesses: string[];
	result: Result;
	solution: string;
}

export enum Result {
	Loss = "loss",
	None = "none",
	Victory = "victory",
}
