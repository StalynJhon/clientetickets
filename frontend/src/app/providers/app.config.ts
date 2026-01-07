import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from '../routes/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ConcertRepository } from '../data/repositories/concert.repository.impl';
import { ConcertRepositoryImpl } from '../data/repositories/concert.repository.impl';
import { TransportRepository } from '../data/repositories/transport.repository.impl'; // ✅ NUEVO
import { TransportRepositoryImpl } from '../data/repositories/transport.repository.impl'; // ✅ NUEVO

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: ConcertRepository, useClass: ConcertRepositoryImpl },
    { provide: TransportRepository, useClass: TransportRepositoryImpl } // ✅ NUEVO
  ]
};