import { Routes } from '@angular/router';
import { InterfazCreacionComponent } from './components/interfaz-creacion/interfaz-creacion.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { authGuard } from './guards/auth-guard.guard';
import { HomePageComponentComponent } from './components/home-page-component/home-page-component.component';
import { HistoryPageComponentComponent } from './components/history-page-component/history-page-component.component';

export const routes: Routes = [
  {
    path: 'nuevo',
    component: InterfazCreacionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'resultados',
    component: ResultadosComponent,
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
];
