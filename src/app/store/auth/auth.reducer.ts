// store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthResponse } from '../../models/authResponse.models';

export interface AuthState {
  userExists: boolean | null;
  authResponse: AuthResponse | null;
  error: any;
  loggedIn: boolean;
}

export const initialState: AuthState = {
  userExists: null,
  authResponse: null,
  error: null,
  loggedIn: false
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.checkUserExistsSuccess, (state, { exists}) => ({
    ...state,
    userExists: exists,
    error: null
  })),
  on(AuthActions.checkUserExistsFail, (state, { fail }) => ({
    ...state,
    fail    
  }))

);
