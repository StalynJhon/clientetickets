import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ConcertRepository } from './data/repositories/concert.repository.impl';
import { ConcertRepositoryImpl } from './data/repositories/concert.repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: ConcertRepository, useClass: ConcertRepositoryImpl }
  ]
};
