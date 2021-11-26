import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import localeEs from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs)

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


//Componentes


import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule

  ],
  providers: [{provide: LOCALE_ID, useValue:'es-CO'}, ],
  schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
