import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isNullOrUndefined } from 'is-what';
import * as moment from 'moment';
import {
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role_Types_Enum } from 'src/generated/graphql';
import { LoggedUser } from '../auth/logged-user.interface';
import { TokenTypes } from '../auth/token-types.enum';
import { Valido } from '../core/valido';
import { VixenComponent } from '../core/vixen/vixen.component';
import { AuthService } from '../services/auth-service';
import { EspiMenu } from './espi-menu.interface';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent
  extends VixenComponent
  implements OnInit, OnDestroy
{
  @ViewChild('drawer') drawer: MatDrawer;
  public readonly isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result: BreakpointState) => result.matches),
      shareReplay()
    );
  menus: EspiMenu[] = [];
  user: LoggedUser;
  private interval: any;
  //currentRole$: Observable<number> = this.auth.userRoleIndex$;
  userObservables: Observable<any>[] = [
    this.auth.user$,
    this.auth.userRoleIndex$,
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private snackbar: MatSnackBar,
    public valido: Valido,
    private auth: AuthService,
    private jwtHelper: JwtHelperService
  ) {
    super(valido);

    if (environment.production === false) {
      const accessT = localStorage.getItem(TokenTypes.ACCESS_TOKEN);
      if (isNullOrUndefined(accessT)) {
        this.onLogout();
      }
      // console.log(accessT);
      const res = this.jwtHelper.decodeToken(accessT);
      this.auth.setLoggedUser(res?.user);
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events
        .pipe(
          withLatestFrom(this.isHandset$),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          filter(([event, b]) => {
            return event instanceof NavigationEnd;
          }),
          switchMap(([a, b]) => {
            if (b) {
              this.drawer.close();
            }
            return [a, b];
          }),
          map(() => {
            // let child = this.activatedRoute?.firstChild;
            // while (child.firstChild) {
            //   child = child.firstChild;
            // }
            // if (child.snapshot.data['title']) {
            //   return child.snapshot.data['title'];
            // }
            return 'TITLE'; //appTitle;
          })
        )
        .subscribe((title: string) => {
          //console.log(title);
        })
    );
    combineLatest(this.userObservables).subscribe((observableResults) => {
      console.log(observableResults);
      this.user = observableResults[0];
      if (this.user) {
        const roleIndex = observableResults[1];
        const currentRole = (
          roleIndex === 0
            ? this.user.roleType.value
            : this.user.secondRoleType.value
        ) as Role_Types_Enum;
        this.buildMenuForThisRole(currentRole);
      } else {
        console.log('the user is gone..');
      }
    });

    this.startRefreshToken();
  }

  private buildMenuForThisRole(role: Role_Types_Enum) {
    console.log('Rebuild menu for role: ' + role);
    this.menus = [];
    switch (role) {
      case Role_Types_Enum.Admin:
      case Role_Types_Enum.CentralLeader:
      case Role_Types_Enum.Central:
      case Role_Types_Enum.SectionLeader:
      case Role_Types_Enum.Section:
        this.menus.push({
          route: 'users',
          label: 'Гласоподаватели',
          matIcon: 'groups',
          badgeSubject: undefined,
        });
        this.menus.push({
          route: 'settlements',
          label: 'Населени места',
          matIcon: 'location_city',
          badgeSubject: undefined,
        });
        this.menus.push({
          route: 'voting-sections',
          label: 'Секции',
          matIcon: 'how_to_vote',
          badgeSubject: undefined,
        });

        this.menus.push({
          route: 'votings/votings-list',
          label: 'Избори',
          matIcon: 'list',
          badgeSubject: undefined,
        });
        this.menus.push({
          route: 'votings/referendums-list',
          label: 'Референдуми',
          matIcon: 'list',
          badgeSubject: undefined,
        });

        this.menus.push({
          route: 'votings/dashboard',
          label: 'Гласуване',
          matIcon: 'front_hand',
          badgeSubject: undefined,
        });

        this.menus.push({
          route: 'votings/dashboard',
          label: 'Преброяване',
          matIcon: 'functions',
          badgeSubject: undefined,
        });
        break;
      case Role_Types_Enum.User:
        this.menus.push({
          route: 'votings',
          label: 'Гласуване',
          matIcon: 'front_hand',
          badgeSubject: undefined,
        });
        break;
      default:
        // ?? Who is here
        this.auth.clearAll();
        break;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeUnloadHander(event): void {
    if (environment.production === true) {
      this.clearUserData();
    } else {
      // console.log('Developer just reloads page..');
    }
  }

  onChangePassword() {
    console.log('change pass');
  }

  onLogout() {
    this.clearUserData();
    this.router.navigate(['auth/login']);
  }

  private clearUserData() {
    this.auth.clearAll();
    if (environment.production === false) {
      this.auth.clearTokensFromLocalStorage();
    }
  }
  onRoleChanged(event: any) {
    const roleIndex: number = parseInt(event.value);
    this.auth.setCurrentRoleIndex(roleIndex);
    this.auth.refreshToken(this.user.id, roleIndex).subscribe((response) => {
      if (response.error) {
        console.log(response.error);
        this.snackbar.open(
          'Възникна грешка. Ролята Ви не беше промемена успешно.',
          'ОК',
          {}
        );
        return;
      }
      if (response.data?.RefreshToken?.fetchToken) {
        const newFetchToken: string = response.data.RefreshToken.fetchToken;
        this.auth.setFetchTokenAndOptionalRedirectToHome(
          newFetchToken,
          this.router,
          true
        );
        this.snackbar.open('Ролята Ви беше променена успешно.', 'ОК', {
          duration: 5000,
        });
      }
    });
  }
  /**
   *
   */
  startRefreshToken() {
    console.log(' start refresh');
    // get current role
    this.authUser();
    this.interval = setInterval(() => {
      this.authUser();
    }, 45 * 1000);
  }

  authUser() {
    this.auth.userRoleIndex$.subscribe((roleIndex) => {
      // console.log('check');
      this.auth.fetchToken$.subscribe((fetchToken) => {
        const expirationDate: Date =
          this.jwtHelper.getTokenExpirationDate(fetchToken);

        const expireMoment = moment(expirationDate);
        const now = moment();
        const minutes = expireMoment.diff(now, 'minutes');
        // console.log(minutes);
        if (minutes <= 2) {
          console.log('call backend');
          this.refreshToken(this.user.id, roleIndex);
        } else {
          console.log('OK');
        }
      });
    });
  }

  private refreshToken(id: number, roleIndex: number) {
    this.auth.refreshToken(this.user.id, roleIndex).subscribe((response) => {
      console.log(response);
      if (response.error || response.errors) {
        this.onLogout();
      }

      if (response.data?.RefreshToken?.fetchToken) {
        const newFetchToken: string = response.data.RefreshToken.fetchToken;
        console.log('NEW TOKEN...');
        this.auth.setFetchTokenAndOptionalRedirectToHome(
          newFetchToken,
          this.router,
          false
        );
      }
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
