import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/http/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router,) { }

  ngOnInit(): void {
  }

  usuario: string = '';
  usuarioVacio:boolean = false;

  onClickIngresar(){
    if(this.usuario!==''){
      this.authService.authenticationService( this.usuario)
      if (this.authService.isUserLoggedIn()) {
        this.router.navigate(['/home']);
      }
    }else{
      this.usuarioVacio = true;
    }
  }

}
