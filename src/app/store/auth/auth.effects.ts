import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../Service/auth.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  checkUserExists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkUserExists),
      mergeMap(({ userId }) =>
        this.authService.checkUserExists(userId).pipe(
          map((exists) => AuthActions.checkUserExistsSuccess({ exists })),
          catchError((fail) =>
            of(AuthActions.checkUserExistsFail({ fail }))
          )
        )
      )
    )
  );
}