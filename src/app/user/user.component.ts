import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../../http/http.service";
import { Request, User } from "../../http/http.types";

@Component({
	selector: "app-user",
	styleUrl: "./user.component.css",
	templateUrl: "./user.component.html",
})
export class UserComponent {
	http: HttpService;
	loaded = false;

	request: Request | null = null;
	user: User | null = null;

	get requestInfo(): string {
		if (this.request === null) {
			return "";
		}

		if (this.request.accepted_at === null) {
			return `Friend request sent: ${this.formatTimestamp(this.request.created_at)}`;
		}

		return `Friends since: ${this.formatTimestamp(this.request.accepted_at)}`;
	}

	get showAccept(): boolean {
		return this.http.loggedIn && this.request !== null && this.request.recipient_id === this.http.id;
	}

	get showCancel(): boolean {
		return this.http.loggedIn && this.request !== null && this.request.sender_id === this.http.id;
	}

	get showRemove(): boolean {
		return this.http.loggedIn && this.request !== null && this.request.accepted_at !== null;
	}

	get showSend(): boolean {
		return this.http.loggedIn && this.user !== null && this.user.user_id !== this.http.id;
	}

	constructor(http: HttpService, route: ActivatedRoute) {
		this.http = http;

		route.paramMap.subscribe((params) => {
			this.load(Number(params.get("id")));
		});
	}

	async acceptRequest(): Promise<void> {
		if (this.user === null) {
			return;
		}

		try {
			this.request = await this.http.acceptRequest(this.user.user_id);
			alert("Friend request accepted!");
		} catch {
			alert("Could not accept friend request!");
		}
	}

	async createRequest(): Promise<void> {
		if (this.user === null) {
			return;
		}

		try {
			this.request = await this.http.createRequest(this.user.user_id);
			alert("Friend request created!");
		} catch {
			alert("Could not create friend request!");
		}
	}

	async deleteRequest(): Promise<void> {
		if (this.user === null) {
			return;
		}

		try {
			await this.http.deleteRequest(this.user.user_id);

			this.request = null;
			alert("Friend request deleted!");
		} catch {
			alert("Could not delete friend request!");
		}
	}

	formatTimestamp(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleString(undefined, {
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			month: "2-digit",
			second: "2-digit",
			year: "numeric",
		});
	}

	async load(id: number): Promise<void> {
		try {
			this.request = await this.http.getRequest(id);
		} catch {
			this.request = null;
		}

		try {
			this.user = await this.http.getUser(id);
		} catch {
			this.user = null;
		}

		this.loaded = true;
	}
}
