import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionComponent } from './componentes/configuracion/configuracion.component';
import { GestionUsuariosComponent } from './componentes/gestion-usuarios/gestion-usuarios.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {path: '', component:ConfiguracionComponent },
      {path: 'usuarios/gestion', component:GestionUsuariosComponent },
     // {path: '**', redirectTo: 'anulacion'}
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
