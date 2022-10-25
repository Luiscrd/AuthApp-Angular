import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario!: Usuario;

  private baseUrl: string = environment.baseUrl;

  get usuario() {

    return { ...this._usuario };

  }

  constructor(

    private http: HttpClient,
    private router: Router,

  ) { }

  registro( name:string, email: string, password: string ) {

    const url = this.baseUrl + '/auth/new';

    const body = { name, email, password };

    return this.http.post<AuthResponse>( url, body ).pipe(
      tap( resp => {

        if ( resp.ok ) {

          localStorage.setItem('token', resp.token! );

        }

      }),
      map( resp => resp.ok ),
      catchError( err => of( err.error.msg ) )
    )

  }

  login( email: string, password: string ) {

    const url = this.baseUrl + '/auth';

    const body = { email, password };

    return this.http.post<AuthResponse>( url, body ).pipe(
      tap( resp => {

        if ( resp.ok ) {

          localStorage.setItem('token', resp.token! );

        }

      }),
      map( resp => resp.ok ),
      catchError( err => of( err.error.msg ) )
    )

  }

  validarToken(): Observable<boolean> {

    const url = this.baseUrl + '/auth/renew';

    const headers = new HttpHeaders().set( 'lc-token', localStorage.getItem('token') || '' )

    return this.http.get<AuthResponse>( url, { headers } ).pipe(
      map( resp => {

        localStorage.setItem('token', resp.token! );

        this._usuario = {
          uid: resp.uid!,
          name: resp.name!,
          email: resp.email!

        }

        return resp.ok;
      }),
      catchError( err => of(false) )
    )

  }

  logout() {

    // Comentar si deseamos converar otros datos
    localStorage.clear();

    localStorage.removeItem('token');

    // this.router.navigateByUrl('/auth/login')

  }

}
