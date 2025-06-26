import { Routes } from '@angular/router';
import { InterfazCreacionComponent } from './components/interfaz-creacion/interfaz-creacion.component';
import { authGuard } from './guards/auth-guard.guard';
import { HomePageComponentComponent } from './components/home-page-component/home-page-component.component';
import { HistoryPageComponentComponent } from './components/history-page-component/history-page-component.component';
import { ResponsePageComponentComponent } from './components/response-page-component/response-page-component.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'nuevo',
    component: InterfazCreacionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    component: HomePageComponentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'history',
    component: HistoryPageComponentComponent,
    canActivate: [authGuard],
  },
 {
    path: 'response/:pk/:sk',
    component: ResponsePageComponentComponent,
    canActivate: [authGuard],
  },
];
