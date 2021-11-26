import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './shared/layout/layout.component';
import { HeaderComponent } from './shared/componentes/header/header.component';
import { SidenavComponent } from './shared/componentes/sidenav/sidenav.component';
import { MaterialModule } from '../material/material.module';
import { FormularioGestionComponent } from './shared/componentes/formulario-gestion/formulario-gestion.component';
import { HistorialAnalisisComponent } from './shared/componentes/historial-analisis/historial-analisis.component';
import { HistorialCasoComponent } from './shared/componentes/historial-caso/historial-caso.component';
import { DiagramaRenderComponent } from './shared/componentes/diagrama-render/diagrama-render.component';
import { SepararPalabrasPipe } from './shared/pipes/separar-palabras.pipe';
import { CalcularVencimientoPipePipe } from './shared/pipes/calcular-vencimiento-pipe.pipe';
import { ProcesosComponent } from './shared/componentes/procesos/procesos.component';
import { BuscadorComponent } from './shared/componentes/buscador/buscador.component';
import { DialogoAnulacionComponent } from './shared/componentes/dialogo-anulacion/dialogo-anulacion.component';
import { DialogoConfirmacionComponent } from './shared/componentes/dialogo-confirmacion/dialogo-confirmacion.component';
import { LoginComponent } from './auth/login/login.component';
import { NombreArchivoPipe } from './shared/pipes/nombre-archivo.pipe';

const components = [
  LayoutComponent,
  HeaderComponent,
  SidenavComponent,
  FormularioGestionComponent,
  HistorialAnalisisComponent,
  HistorialCasoComponent,
  DiagramaRenderComponent,
  BuscadorComponent,
  ProcesosComponent,
  DialogoAnulacionComponent,
  DialogoConfirmacionComponent,
  LoginComponent,
  SepararPalabrasPipe,
  CalcularVencimientoPipePipe,];

@NgModule({
  declarations: [components, NombreArchivoPipe],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MaterialModule
  ],
  exports:[
    components
  ],
})
export class CoreModule { }
