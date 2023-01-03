import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NetCoreApiComponent } from './net-core-api/net-core-api.component';
import { AppRoutingModule } from './app-routing.module';
import { DocumentIndexStoreModule } from './store/document-index/document-index-store.module';
import { DocumentSearchStoreModule } from './store/document-search/document-search-store.module';
import { LoadingStoreModule } from './store/loading/loading-store.module';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { reducers } from './store';
import { LoadingBarComponent } from './shared/components/loading-bar/loading-bar.component';
import { DocumentComponent } from './shared/components/markdown/document/document.component';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(),
    DocumentIndexStoreModule,
    DocumentSearchStoreModule,
    LoadingStoreModule,
    AppRoutingModule,
    StoreRouterConnectingModule.forRoot(),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
    }),
    LoadingBarComponent,
    DocumentComponent,
    NetCoreApiComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
