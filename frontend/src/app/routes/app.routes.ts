import { Routes } from '@angular/router';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { ProfileComponent } from '../features/profile/pages/profile.component';
import { HistorialComponent } from '../features/historial/pages/historial.component';

import { InfoEmpresaComponent } from '../features/configuracion/info-empresa/info-empresa.component';
import { TerminosCondicionesComponent } from '../features/configuracion/terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from '../features/configuracion/politica-privacidad/politica-privacidad.component';
import { AyudaFaqComponent } from '../features/configuracion/ayuda-faq/ayuda-faq.component';
import { PromocionesPublicasComponent } from '../features/promociones-publicas/pages/promociones-publicas.component';

export const routes: Routes = [
  // Ruta principal → Dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'eventos', component: EventosComponent },

  // Clientes
  { path: 'clientes', component: ClienteListComponent },

  // Usuario
  { path: 'perfil', component: ProfileComponent },
  { path: 'historial', component: HistorialComponent },

  // Promociones
  { path: 'promociones', component: PromocionesPublicasComponent },

  // Configuración informativa
  { path: 'empresa', component: InfoEmpresaComponent },
  { path: 'terminos', component: TerminosCondicionesComponent },
  { path: 'privacidad', component: PoliticaPrivacidadComponent },
  { path: 'ayuda', component: AyudaFaqComponent },

  // Cualquier ruta inválida → Dashboard
  { path: '**', redirectTo: 'dashboard' }
];
