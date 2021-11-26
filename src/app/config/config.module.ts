import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfiguracionComponent } from './componentes/configuracion/configuracion.component';
import { GestionUsuariosComponent } from './componentes/gestion-usuarios/gestion-usuarios.component';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';

const components = [
  ConfiguracionComponent,
  GestionUsuariosComponent,]


@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    CoreModule,
    MaterialModule
  ]
})
export class ConfigModule { }
