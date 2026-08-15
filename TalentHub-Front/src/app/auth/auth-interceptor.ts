import {
  Injectable
} from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  throwError,
  BehaviorSubject
} from 'rxjs';

import {
  catchError,
  filter,
  take,
  switchMap
} from 'rxjs/operators';

import {
  AuthService
} from '../services/auth';


@Injectable()
export class AuthInterceptor
  implements HttpInterceptor {


  private isRefreshing = false;


  private refreshTokenSubject =
    new BehaviorSubject<string | null>(
      null
    );


  constructor(
    private auth: AuthService
  ) {}


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    // ========================================================
    // NE JAMAIS INTERCEPTER LES ENDPOINTS JWT
    // ========================================================

    if (
      request.url.includes(
        '/api/token/'
      )
    ) {

      return next.handle(
        request
      );

    }


    // ========================================================
    // ACCESS TOKEN
    // ========================================================

    const token =
      this.auth.getAccessToken();


    let authRequest =
      request;


    if (token) {

      authRequest =
        this.addToken(
          request,
          token
        );

    }


    // ========================================================
    // ENVOYER REQUÊTE
    // ========================================================

    return next.handle(
      authRequest
    ).pipe(

      catchError(
        (error: HttpErrorResponse) => {

          if (
            error.status !== 401
          ) {

            return throwError(
              () => error
            );

          }


          return this.handle401Error(
            authRequest,
            next
          );

        }

      )

    );

  }


  // ============================================================
  // AJOUT TOKEN
  // ============================================================

  private addToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {

    return request.clone({

      setHeaders: {

        Authorization:
          `Bearer ${token}`

      }

    });

  }


  // ============================================================
  // GESTION 401
  // ============================================================

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    // ========================================================
    // REFRESH DÉJÀ EN COURS
    // ========================================================

    if (
      this.isRefreshing
    ) {

      return this.refreshTokenSubject
        .pipe(

          filter(
            token => token !== null
          ),

          take(1),

          switchMap(
            token => {

              return next.handle(
                this.addToken(
                  request,
                  token!
                )
              );

            }

          )

        );

    }


    // ========================================================
    // RÉCUPÉRER REFRESH TOKEN
    // ========================================================

    const refreshToken =
      this.auth.getRefreshToken();


    if (!refreshToken) {

      this.auth.logout();

      return throwError(
        () =>
          new Error(
            'Refresh token absent.'
          )
      );

    }


    // ========================================================
    // COMMENCER REFRESH
    // ========================================================

    this.isRefreshing = true;

    this.refreshTokenSubject.next(
      null
    );


    return this.auth
      .refreshToken()
      .pipe(

        switchMap(
          response => {

            this.isRefreshing =
              false;


            this.refreshTokenSubject.next(
              response.access
            );


            return next.handle(

              this.addToken(
                request,
                response.access
              )

            );

          }

        ),

        catchError(
          refreshError => {

            this.isRefreshing =
              false;

            this.auth.logout();

            this.refreshTokenSubject.next(
              null
            );

            return throwError(
              () => refreshError
            );

          }

        )

      );

  }

}