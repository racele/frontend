import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HttpService } from "../../../http/http.service";
import { Request, User } from "../../../http/http.types";

@Component({
	imports: [RouterLink],
	selector: "app-entry",
	styleUrl: "./entry.component.css",
	templateUrl: "./entry.component.html",
})
export class EntryComponent {
	http: HttpService;

	loaded = false;
	user: User | null = null;

	@Input({ required: true })
	request!: Request;

	@Input({ required: true })
	status!: string;

	constructor(http: HttpService) {
		this.http = http;
	}

	async ngOnInit(): Promise<void> {
		try {
			if (this.request.recipient_id === this.http.id) {
				this.user = await this.http.getUser(this.request.sender_id);
			} else {
				this.user = await this.http.getUser(this.request.recipient_id);
			}
		} catch {
			this.user = null;
		}

		this.loaded = true;
	}
}
