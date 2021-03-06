import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterFailComponent } from './auth/register-fail/register-fail.component';
import { RegisterSuccessComponent } from './auth/register-success/register-success.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { DefaultComponent } from './layouts/default/default.component';
import { LoginGuard } from './quards/login.quard';

const routes: Routes = [
  // { path: '', redirectTo: 'votings', pathMatch: 'full' },
  {
    path: '',
    component: DefaultComponent,
    data: { breadcrumb: 'home' },
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'register',
        children: [
          { path: '', component: RegisterComponent },
          {
            path: 'success',
            component: RegisterSuccessComponent,
            //canActivate: [PostRegistrationGuard],
          },
          {
            path: 'fail',
            component: RegisterFailComponent,
            // canActivate: [PostRegistrationGuard],
          },
        ],
        canActivate: [LoginGuard],
      },
      // { path: 'auth/reset-password', component: HandleResetPasswordComponent },
      // { path: 'auth/confirm-email', component: ConfirmEmailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
