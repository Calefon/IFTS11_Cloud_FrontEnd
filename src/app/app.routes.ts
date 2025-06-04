import { Routes } from '@angular/router';
import { InterfazCreacionComponent } from './components/interfaz-creacion/interfaz-creacion.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { authGuard } from './guards/auth-guard.guard';


export const routes: Routes = [
    {path: 'nuevo', component: InterfazCreacionComponent, canActivate:[authGuard]},
    {path: 'resultados', component: ResultadosComponent, canActivate:[authGuard]},
];
