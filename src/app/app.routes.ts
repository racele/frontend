import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { WipComponent } from "./wip/wip.component";

export const routes: Routes = [
	{
		component: HomeComponent,
		path: "",
		title: "Racele",
	},
	{
		component: LoginComponent,
		path: "login",
		title: "Login",
	},
	{
		component: LogoutComponent,
		path: "logout",
		title: "Logout",
	},
	{
		component: WipComponent,
		path: "**",
		title: "Under Construction",
	},
];
