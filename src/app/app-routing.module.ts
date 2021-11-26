import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { PerfilGuard } from './core/auth/guards/perfil.guard';
import { LoginComponent } from './core/auth/login/login.component';
import { BuscadorComponent } from './core/shared/componentes/buscador/buscador.component';
import { FormularioGestionComponent } from './core/shared/componentes/formulario-gestion/formulario-gestion.component';
import { ProcesosComponent } from './core/shared/componentes/procesos/procesos.component';

import { LayoutComponent } from './core/shared/layout/layout.component';

const routes: Routes = [
  { path:'',
    component: LayoutComponent,
    canActivate:[AuthGuard],
    children:[
      //{path:'',redirectTo:'home', pathMatch:'full'},
      // {path:'**',redirectTo:'home', pathMatch:'full'},
      {path:'', pathMatch:'full',component:BuscadorComponent,
        children:  [
        {path: 'id/:idproceso', component:FormularioGestionComponent}
      ] },
      {
        path:'procesos/:estadoSeleccionado', component:ProcesosComponent,
        canActivate:[AuthGuard],
        children:  [
          {path: 'id/:idproceso', component:FormularioGestionComponent}
        ]
      },
      {
        path:'administrar',
        canActivate:[AuthGuard, PerfilGuard],
        canLoad:[PerfilGuard],
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      },
      {
        path:'configuracion',
        canActivate:[AuthGuard, PerfilGuard],
        canLoad:[PerfilGuard],
        loadChildren: () => import('./config/config.module').then(m => m.ConfigModule)
      }
    ]
  },
  {path:'login',component:LoginComponent},
  {path:'**',redirectTo:''},
];

/*
const routes: Routes = [
  {path: 'home', component:BuscadorComponent,
    children:  [
      {path: 'busqueda/id/:idproceso', component:FormularioGestionComponent}
    ] },
  {path: 'procesos/:estadoSeleccionado', component:ProcesosComponent,
    children:  [
      {path: 'id/:idproceso', component:FormularioGestionComponent}
    ] },
  {path: 'procesos', component:ProcesosComponent },
  {path: 'administrar/anulacion', component:AnulacionComponent },
  {path: 'administrar/historico/:procesosFinalizados', component:ProcesosComponent,
    children:  [
      {path: 'id/:idproceso', component:FormularioGestionComponent}
    ] },
  {path: 'administrar/procesos/:procesos', component:ProcesosComponent,
    children:  [
      {path: 'id/:idproceso', component:FormularioGestionComponent}
    ] },
  {path: 'administrar/procesosFinalizados', component:HistoricoFinalizadosComponent },
  {path: 'administrar/procesosAnulados', component:ProcesosAnuladosComponent },
  {path: 'administrar/procesosSuspendidos', component:ProcesosAnuladosComponent },
  {path: 'administrar/procesosErrorWS', component:ProcesosErrorWSComponent },
  {path: 'administrar/reasignacion', component:ReasignacionComponent },
  {path: 'configuracion', component:ConfiguracionComponent },
  {path: 'usuarios/gestion', component:GestionUsuariosComponent },
  {path: 'administrar/reporteA', component:ReportesComponent },
  {path: '', pathMatch:'full', redirectTo: 'home'},
  // {path: '**', redirectTo: 'home'},
];
*/

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
