import { Route } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { DashboardStore } from './dashboard/stores/dashboard.store';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: Dashboard,
    providers: [
      DashboardStore,
    ]
  }];
