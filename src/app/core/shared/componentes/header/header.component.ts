import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/servicios/http/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() menuPulsado: EventEmitter<string>;
  usuarioLoggeado:string = '';

  constructor(private authService: AuthService,
              private router: Router) {
    this.menuPulsado = new EventEmitter();
   }

  ngOnInit(): void {
    this.usuarioLoggeado = this.authService.getLoggedInUserName();
  }

  onClick($event: Event){
    this.menuPulsado.emit('Menu Pulsado');
  }

  onClickHome(){
    this.router.navigate(['home']);
  }

  onClickConfig(){
    this.router.navigate(['/configuracion']);
  }

  onClickLogout(){
    this.authService.logout();
  }
}
