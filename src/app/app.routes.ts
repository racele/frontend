import { Routes } from "@angular/router";
import { Mode } from "../words/words.types";
import { FriendsComponent } from "./friends/friends.component";
import { GameComponent } from "./game/game.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { UserComponent } from "./user/user.component";
import { WipComponent } from "./wip/wip.component";

export const routes: Routes = [
	{
		component: HomeComponent,
		path: "",
		title: "Racele",
	},
	{
		component: GameComponent,
		data: { mode: Mode.Daily },
		path: "daily",
		title: "Daily Racele",
	},
	{
		component: FriendsComponent,
		path: "friends",
		title: "Friends",
	},
	{
		component: LeaderboardComponent,
		path: "leaderboard",
		title: "Leaderboard",
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
		component: GameComponent,
		data: { mode: Mode.Practice },
		path: "practice",
		title: "Practice",
	},
	{
		component: UserComponent,
		path: "users/:id",
		title: "User Information",
	},
	{
		component: WipComponent,
		path: "**",
		title: "Under Construction",
	},
];
