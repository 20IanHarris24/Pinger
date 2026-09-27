import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools'; //dependency
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { API_BASE_URL } from './services/api/pingapp-api.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { shipReducer } from './state/reducers/ship.reducers';
import { ShipEffects } from './state/effects/ship.effects';
import { environment } from './services/environments/environment';
import { credentialsInterceptor } from './interceptors/credentials.interceptors';


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
    provideHttpClient(
      withInterceptors([credentialsInterceptor]),
    ),
    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl
    }
  ],
};
