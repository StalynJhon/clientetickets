import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ConciertosListComponent } from './features/conciertos/conciertos-list.component';
import { ConciertoDetailComponent } from './features/conciertos/concierto-detail.component';
import { TransporteListComponent } from './features/transporte/transporte-list.component';
import { TransporteDetailComponent } from './features/transporte/transporte-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  { path: 'conciertos', component: ConciertosListComponent },
  { path: 'conciertos/:id', component: ConciertoDetailComponent },
  
  { path: 'transporte', component: TransporteListComponent },
  { path: 'transporte/:id', component: TransporteDetailComponent },
  
  { path: '**', redirectTo: 'dashboard' }
];
