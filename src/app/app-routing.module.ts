import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./splash/splash.module').then((m) => m.SplashPageModule),
  },
  {
    path: 'pages',
    // redirectTo: 'pages',
    // pathMatch: 'full',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'welcome-screen',
    loadChildren: () => import('./welcome-screen/welcome-screen.module').then(m => m.WelcomeScreenPageModule)
  },
  // { path: '**', redirectTo: '/splash' }
  // {
  //   path: 'pages',
  //   loadChildren: () =>
  //     import('./pages/pages.module').then((m) => m.PagesModule),
  // },
  // {
  //   path: 'report',
  //   loadChildren: () => import('./pages/report/report.module').then(m => m.ReportPageModule)
  // },
  // {
  //   path: 'report',
  //   loadChildren: () => import('./pages/report/report.module').then(m => m.ReportPageModule)
  // },
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./page/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
