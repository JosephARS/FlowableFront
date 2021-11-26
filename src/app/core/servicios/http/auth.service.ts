import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  ID_USUARIO_LOGGEADO = 'authenticatedUser'
  PERFIL_USUARIO_LOGGEADO = 'perfilUser'

  public username: string ='';
  public password: string;
 // public isLoggedIn = false;

  constructor(private router: Router) {
    console.log(this.username);
  }

  authenticationService(username: string, password?: string) {
    this.username = username;
    this.password = password;
    this.registerSuccessfulLogin(username, password);
  }

  registerSuccessfulLogin(username, password) {
    sessionStorage.setItem(this.ID_USUARIO_LOGGEADO, username)
    let perfil = 'analista'
    if (username == 'Analista5') {
      perfil = 'admin'
    }
    sessionStorage.setItem(this.PERFIL_USUARIO_LOGGEADO, perfil)

  }

  logout() {
    this.router.navigate(['/login']).then( () => {window.location.reload()} );
    sessionStorage.removeItem(this.ID_USUARIO_LOGGEADO);
    sessionStorage.removeItem(this.PERFIL_USUARIO_LOGGEADO);
    this.username = null;
    this.password = null;

  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(this.ID_USUARIO_LOGGEADO)
    console.log(user);
    if (user === null) return false
      return true
  }

  getLoggedInUserName() {
    let user = sessionStorage.getItem(this.ID_USUARIO_LOGGEADO)
    console.log(user);
    if (user === null) return ''
    return user
  }

  getPerfilUser(){
    let user = sessionStorage.getItem(this.PERFIL_USUARIO_LOGGEADO)
    console.log("Oerfil:" + user);
    if (user === null) return ''
    return user
  }

}
