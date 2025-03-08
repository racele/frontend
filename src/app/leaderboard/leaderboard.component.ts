import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../http/http.service';
import { Score } from '../../http/http.types';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  http: HttpService;
  router: Router;
  scores: Score[] = [];
  scoresDaily: Score[] = [];
  scoresPractice: Score[] = [];
  showDaily = false;

  constructor(http: HttpService, router: Router) {
    this.http = http;
    this.router = router;
  }



  async ngAfterViewInit(): Promise<void> {
    try {
      const dailyScoresResult = await this.http.getScoresDaily();
      const practiceScoresResult = await this.http.getScoresPractice();
      this.scoresDaily = "message" in dailyScoresResult ? [] : dailyScoresResult;
      this.scoresPractice = "message" in practiceScoresResult ? [] : practiceScoresResult;
    } catch {
      alert("Could not read Scores");
    }
    this.scoresDaily.sort((a, b) => a.time - b.time);
    this.scoresPractice.sort((a, b) => a.time - b.time);
    this.scores = this.scoresPractice;
  }

  formatTime(time: number): string {
    const format = new Intl.DateTimeFormat(undefined, {
      fractionalSecondDigits: 3,
      minute: "2-digit",
      second: "2-digit",
    });
    return format.format(time);
  }

  setScoreType(type: 'daily' | 'practice'): void {
    this.showDaily = type === 'daily';
    this.scores = this.showDaily ? this.scoresDaily : this.scoresPractice;
  }
}