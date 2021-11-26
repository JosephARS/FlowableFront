import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../servicios/http/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilGuard implements CanLoad, CanActivate {

  constructor(private authService: AuthService,){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let perfil = this.authService.getPerfilUser();

    if ( perfil !== 'admin') {
      window.alert('No tiene suficientes privilegios para acceder a este módulo')
      return false
    }else{
      return true
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let perfil = this.authService.getPerfilUser();

    if ( perfil !== 'admin') {
      window.alert('No tiene suficientes privilegios para acceder a este módulo')
      return false
    }else{
      return true
    }

  }

}
