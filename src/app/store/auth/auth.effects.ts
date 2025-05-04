import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../Service/auth.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  checkUserExists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkUserExists),
      mergeMap(({ userId }) =>
        this.authService.getMemberByUserID(userId).pipe(
          map((member) => {          
            return AuthActions.checkUserExistsSuccess({ member });
          }),
          catchError((error) => {
            if (error.status === 404) {            
              return of(AuthActions.checkUserExistsSuccess({ member: null }));
            }          
            return of(AuthActions.checkUserExistsFail({ error }));
          })
        )
      )
    )
  );

  getMemberByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getMemberById),
      mergeMap(({ userId }) =>
        this.authService.getMemberByUserID(userId).pipe(
          map(member => AuthActions.getMemberByIdSuccess({ member })),
          catchError(error => of(AuthActions.getMemberByIdFail({ error })))
        )
      )
    )
  );
  
  
}
