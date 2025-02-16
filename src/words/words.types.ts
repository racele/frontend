export enum Mode {
	Daily = "daily",
	Practice = "practice",
	Unknown = "unknown",
}

export interface Progress {
	date: string | null;
	guesses: string[];
	solution: string | null;
	state: State;
}

export enum State {
	Initial = "initial",
	Loss = "loss",
	Running = "running",
	Victory = "victory",
}
