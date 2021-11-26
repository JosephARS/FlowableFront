import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnulacionComponent } from './pages/anulacion/anulacion.component';
import { HistoricoFinalizadosComponent } from './pages/historico-finalizados/historico-finalizados.component';
import { ProcesosAnuladosComponent } from './pages/procesos-anulados/procesos-anulados.component';
import { ProcesosErrorWSComponent } from './pages/procesos-error-ws/procesos-error-ws.component';
import { ReasignacionComponent } from './pages/reasignacion/reasignacion.component';
import { PruebasAdminComponent } from './pages/pruebas-admin/pruebas-admin.component';
import { ProcesosComponent } from '../core/shared/componentes/procesos/procesos.component';
import { FormularioGestionComponent } from '../core/shared/componentes/formulario-gestion/formulario-gestion.component';

const routes: Routes = [

  {
    path:'',
    children:[
      {path: 'anulacion', component:AnulacionComponent },
      {path: 'reasignacion', component:ReasignacionComponent },
      {path: 'historico/procesosActivos/:procesosFinalizados', component:ProcesosComponent,
        children:  [
          {path: 'id/:idproceso', component:FormularioGestionComponent}
        ]
      },
      {path: 'historico/procesosFinalizados', component:HistoricoFinalizadosComponent },
      {path: 'historico/procesosAnulados', component:ProcesosAnuladosComponent },
      {path: 'historico/procesosPendientes/:procesos', component:ProcesosComponent,
        children:  [
          {path: 'id/:idproceso', component:FormularioGestionComponent}
        ]
      },
      {path: 'historico/procesosSuspendidos', component:ProcesosErrorWSComponent },
      {path: 'prueba', component:PruebasAdminComponent},
      {path: '**', redirectTo: 'anulacion'}
    ]

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
