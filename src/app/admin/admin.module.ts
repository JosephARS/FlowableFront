import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PruebasAdminComponent } from './pages/pruebas-admin/pruebas-admin.component';
import { AnulacionComponent } from './pages/anulacion/anulacion.component';
import { ReasignacionComponent } from './pages/reasignacion/reasignacion.component';
import { MaterialModule } from '../material/material.module';
import { HistoricoFinalizadosComponent } from './pages/historico-finalizados/historico-finalizados.component';
import { ProcesosAnuladosComponent } from './pages/procesos-anulados/procesos-anulados.component';
import { ProcesosErrorWSComponent } from './pages/procesos-error-ws/procesos-error-ws.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    PruebasAdminComponent,
    AnulacionComponent,
    ReasignacionComponent,
    HistoricoFinalizadosComponent,
    ProcesosAnuladosComponent,
    ProcesosErrorWSComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    CoreModule
  ]
})
export class AdminModule { }
