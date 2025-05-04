import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthResponse } from '../../models/authResponse.models';
import { MemberDTO } from '../../interfaces/interface';

export interface AuthState {
  userExists: boolean | null;
  member: MemberDTO | null;
  authResponse: AuthResponse | null;
  error: any;
  loggedIn: boolean;
}

export const initialState: AuthState = {
  userExists: null,
  member: null,
  authResponse: null,
  error: null,
  loggedIn: false
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.checkUserExistsSuccess, (state, { member }) => ({
    ...state,
    userExists: true,
    member,
    error: null
  })),
  on(AuthActions.checkUserExistsFail, (state, { error }) => ({
    ...state,
    userExists: false,
    member: null,
    error
  })),
  on(AuthActions.getMemberByIdSuccess, (state, { member }) => ({
    ...state,
    userExists: null,
    member,
    error: null
  })),
  on(AuthActions.getMemberByIdFail, (state, { error }) => ({
    ...state,
    userExists: null,
    member :null,
    error
  })),
);

