export enum Mode {
	Daily = "daily",
	Practice = "practice",
	Unknown = "unknown",
}

export interface Progress {
	date: string | null;
	guesses: string[];
	posted: boolean;
	solution: string | null;
	state: State;
	time: Time;
}

export enum State {
	Initial = "initial",
	Loss = "loss",
	Running = "running",
	Victory = "victory",
}

export interface Time {
	end?: number;
	start?: number;
}
