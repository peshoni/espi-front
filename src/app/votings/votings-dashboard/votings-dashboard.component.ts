import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Votings } from 'src/generated/graphql';
import { VotingsService } from '../voting-service.service';
interface VotingParams {
  title: string;
  text: string;
  cols: number;
  rows: number;
  type: string; // enum
  id: number;
  // TODO add params ..
}
@Component({
  selector: 'app-votings-dashboard',
  templateUrl: './votings-dashboard.component.html',
  styleUrls: ['./votings-dashboard.component.scss'],
})
export class VotingsDashboardComponent {
  votings: BehaviorSubject<VotingParams[]> = new BehaviorSubject([]);
  /** Based on the screen size, switch from standard to one column per row */
  cards: Observable<VotingParams[]>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private voitngsService: VotingsService
  ) {
    this.getStartedVotings();
    this.initVotingsCards();
  }
  getStartedVotings() {
    this.voitngsService.getStartedVotings().subscribe((response) => {
      if (response.data) {
        const votings: Votings[] = response.data.votings as Votings[];
        console.log(votings);
        console.log(response.data.votings_aggregate.aggregate.count);
        // const votingsCount = response.data.
      }
      console.log(response);
    });
  }

  initVotingsCards() {
    // Get the current votings from database..
    this.cards = from(this.voitngsService.getReferendums(99, null, {}, {}).result())
      .pipe(map(r => r.data.referendums.map((ref, i) => {
        return {
          title: ref.name,
          text: ref.description,
          cols: 1,
          rows: 1,
          type: 'alabala',
          id: i,
        } as VotingParams
      })));


  }

  goToVotingComponent(vote: VotingParams) {
    console.log('go to vote', vote);
    // console.log(this.activatedRoute.url.);
    // this.router.navigate(['vote'], {
    //   relativeTo: this.activatedRoute,
    // });
    if (vote.id === 1) {
      this.router.navigate(['vote'], {
        relativeTo: this.activatedRoute,
      });
    }
    if (vote.id === 2) {
      this.router.navigate(['referendum'], {
        relativeTo: this.activatedRoute,
      });
    }
    // alert(JSON.stringify(vote));
    //console.log(vote);
  }
}
