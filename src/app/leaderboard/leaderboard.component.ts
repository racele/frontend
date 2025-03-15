import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../http/http.service";
import { Score } from "../../http/http.types";

@Component({
	selector: "app-leaderboard",
	styleUrl: "./leaderboard.component.css",
	templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent implements OnInit {
	http: HttpService;

	daily: Score[] = [];
	practice: Score[] = [];
	showDaily = true;

	constructor(http: HttpService) {
		this.http = http;
	}

	get scores(): Score[] {
		if (this.showDaily) {
			return this.daily;
		}

		return this.practice;
	}

	formatDate(date: string | null): string {
		if (date === null) {
			return "Unknown";
		}

		return new Date(date).toLocaleDateString(undefined, {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}

	formatTime(time: number): string {
		return new Date(time).toLocaleTimeString(undefined, {
			fractionalSecondDigits: 3,
			minute: "2-digit",
			second: "2-digit",
		});
	}

	async ngOnInit(): Promise<void> {
		try {
			this.daily = await this.http.listDaily();
			this.practice = await this.http.listPractice();
		} catch {
			alert("Could not load scores!");
		}
	}

	toggleMode(): void {
		this.showDaily = !this.showDaily;
	}
}
