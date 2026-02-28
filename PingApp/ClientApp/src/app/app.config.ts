import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools'; //dependancy
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { API_BASE_URL } from './services/api/pingapp-api.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { shipReducer } from './state/reducers/ship.reducers';
import { ShipEffects } from './state/effects/ship.effects';
import {environment} from './services/environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      StoreModule.forRoot(
        {
          ships: shipReducer,
        },
        {}
      ),
      EffectsModule.forRoot([ShipEffects]) //shipEffects
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production, //dependency
    }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: API_BASE_URL,
      useFactory: () => 'http://' + window.location.hostname + ':34011',
    },
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl }
  ],
};
