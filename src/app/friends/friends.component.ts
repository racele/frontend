import { Component } from "@angular/core";
import { HttpService } from "../../http/http.service";
import { Request } from "../../http/http.types";
import { EntryComponent } from "./entry/entry.component";

@Component({
	imports: [EntryComponent],
	selector: "app-friends",
	styleUrl: "./friends.component.css",
	templateUrl: "./friends.component.html",
})
export class FriendsComponent {
	http: HttpService;
	status = "accepted";

	accepted: Request[] = [];
	received: Request[] = [];
	sent: Request[] = [];

	get requests(): Request[] {
		if (this.showAccepted) {
			return this.accepted;
		}

		if (this.showReceived) {
			return this.received;
		}

		return this.sent;
	}

	get showAccepted(): boolean {
		return this.status === "accepted";
	}

	get showReceived(): boolean {
		return this.status === "received";
	}

	get showSent(): boolean {
		return this.status === "sent";
	}

	constructor(http: HttpService) {
		this.http = http;
	}

	async ngOnInit(): Promise<void> {
		try {
			this.accepted = await this.http.listRequests("accepted");
			this.received = await this.http.listRequests("received");
			this.sent = await this.http.listRequests("sent");
		} catch {
			alert("Could not load requests!");
		}
	}

	setStatus(status: string) {
		this.status = status;
	}
}
