import { Routes } from '@angular/router';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { ProfileComponent } from '../features/profile/pages/profile.component';
import { HistorialComponent } from '../features/historial/pages/historial.component';

// conciertos y transporte
import { ConciertosListComponent } from '../features/conciertos/conciertos-list.component';
import { ConciertoDetailComponent } from '../features/conciertos/concierto-detail.component';
import { TransporteListComponent } from '../features/transporte/transporte-list.component';
import { TransporteDetailComponent } from '../features/transporte/transporte-detail.component';

// Configuración / informativas
import { InfoEmpresaComponent } from '../features/configuracion/info-empresa/info-empresa.component';
import { TerminosCondicionesComponent } from '../features/configuracion/terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from '../features/configuracion/politica-privacidad/politica-privacidad.component';
import { AyudaFaqComponent } from '../features/configuracion/ayuda-faq/ayuda-faq.component';

// Promociones
import { PromocionesPublicasComponent } from '../features/promociones-publicas/pages/promociones-publicas.component';

// Productos / checkout / notas
import { ProductListComponent } from '../features/products/pages/product-list.component';
import { CheckoutComponent } from '../features/checkout/pages/checkout.component';
import { NotasComponent } from '../features/notas/notas.component';

export const routes: Routes = [
  // Ruta principal
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard y eventos
  { path: 'dashboard', component: DashboardComponent },
  { path: 'eventos', component: EventosComponent },

  // Usuario
  { path: 'perfil', component: ProfileComponent },
  { path: 'historial', component: HistorialComponent },

  // Promociones
  { path: 'promociones', component: PromocionesPublicasComponent },

  // Productos y ventas
  { path: 'productos', component: ProductListComponent },
  { path: 'checkout', component: CheckoutComponent },

  // Notas
  { path: 'notas', component: NotasComponent },

  // conciertos
  { path: 'conciertos', component: ConciertosListComponent },
  { path: 'conciertos/:id', component: ConciertoDetailComponent },

  // transporte
  { path: 'transporte', component: TransporteListComponent },
  { path: 'transporte/:id', component: TransporteDetailComponent },

  // Configuración informativa
  { path: 'empresa', component: InfoEmpresaComponent },
  { path: 'terminos', component: TerminosCondicionesComponent },
  { path: 'privacidad', component: PoliticaPrivacidadComponent },
  { path: 'ayuda', component: AyudaFaqComponent },

  // Ruta comodín
  { path: '**', redirectTo: 'dashboard' }
];
