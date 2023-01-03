import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { MyTitleStrategyService } from './app/shared/services/markdown-document-title-strategy.service';
import { reducers } from './app/store';
import { DocumentIndexStoreModule } from './app/store/document-index/document-index-store.module';
import { DocumentSearchStoreModule } from './app/store/document-search/document-search-store.module';
import { LoadingStoreModule } from './app/store/loading/loading-store.module';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./app/home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: 'search',
    title: 'Search',
    loadComponent: () => import('./app/markdown-document/search/search.component').then((mod) => mod.SearchComponent),
  },
  {
    path: 'doc/:ref',
    loadChildren: () => import('./app/markdown-document/display/routes'),
  },
  {
    path: 'color-check',
    title: 'Color Check',
    loadComponent: () => import('./app/color-check/color-check.component').then((mod) => mod.ColorCheckComponent),
  },
  {
    path: 'test-api',
    title: 'API Test',
    loadComponent: () => import('./app/net-core-api/net-core-api.component').then((mod) => mod.NetCoreApiComponent),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
    { provide: TitleStrategy, useClass: MyTitleStrategyService },
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      RouterModule.forRoot(routes),
      StoreModule.forRoot(reducers),
      EffectsModule.forRoot(),
      DocumentIndexStoreModule,
      DocumentSearchStoreModule,
      LoadingStoreModule,
      StoreRouterConnectingModule.forRoot(),
      // Instrumentation must be imported after importing StoreModule (config is optional)
      StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: !isDevMode(), // Restrict extension to log-only mode
      })
    ),
  ],
}).catch((err) => console.error(err));
