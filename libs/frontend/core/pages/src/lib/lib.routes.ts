import { Route } from '@angular/router';
import { Home } from './home/home';
import { PageNotFound } from './page-not-found/page-not-found';

export const pagesRoutes: Route[] = [
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'page-not-found', component: PageNotFound },
  { path: '**', component: PageNotFound },
  {
  path: 'auth',
  loadChildren: () => import('@fe/auth').then((m) => m.authRoutes),
},

];
