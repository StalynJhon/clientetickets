import { Routes } from '@angular/router';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { ProfileComponent } from '../features/profile/pages/profile.component';
import { HistorialComponent } from '../features/historial/pages/historial.component';

// conciertos y transporte
import { ConciertosListComponent } from '../features/eventos/conciertos/pages/conciertos-list.component';
import { ConciertoDetailComponent } from '../features/eventos/conciertos/pages/concierto-detail.component';
import { TransporteListComponent } from '../features/eventos/transporte/pages/transporte-list.component';
import { TransporteDetailComponent } from '../features/eventos/transporte/pages/transporte-detail.component';
// Configuración / informativas
import { InfoEmpresaComponent } from '../features/configuracion/info-empresa/info-empresa.component';
import { TerminosCondicionesComponent } from '../features/configuracion/terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from '../features/configuracion/politica-privacidad/politica-privacidad.component';
import { AyudaFaqComponent } from '../features/configuracion/ayuda-faq/ayuda-faq.component';

// Promociones
import { PromocionesPublicasComponent } from '../features/promociones-publicas/pages/promociones-publicas.component';

// Productos / checkout / 
import { ProductListComponent } from '../features/products/pages/product-list.component';
import { CheckoutComponent } from '../features/checkout/pages/checkout.component';

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
