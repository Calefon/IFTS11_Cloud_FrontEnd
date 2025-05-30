import { Routes } from '@angular/router';
import { InterfazCreacionComponent } from './components/interfaz-creacion/interfaz-creacion.component';
import { ResultadosComponent } from './components/resultados/resultados.component';

export const routes: Routes = [
    {path: 'nuevo', component: InterfazCreacionComponent},
    {path: 'resultados', component: ResultadosComponent}
];
