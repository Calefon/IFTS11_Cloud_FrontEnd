import { Routes } from '@angular/router';
import { InterfazCreacionComponent } from './components/interfaz-creacion/interfaz-creacion.component';
import { authGuard } from './guards/auth-guard.guard';
import { HomePageComponentComponent } from './components/home-page-component/home-page-component.component';
import { HistoryPageComponentComponent } from './components/history-page-component/history-page-component.component';
import { ResponsePageComponentComponent } from './components/response-page-component/response-page-component.component';
import { EditarPageComponentComponent} from './components/editar-page-component/editar-page-component.component';
export const routes: Routes = [
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
  {
  path: 'editar-encuesta/:pk/:sk',
  component: EditarPageComponentComponent,
 canActivate: [authGuard]
}
,
{
  path: 'encuesta/:pk/:sk',
  loadComponent: () =>
    import('./pages/encuesta-page/encuesta-page.component').then(
      (m) => m.EncuestaPageComponent
    ),
},


];
