
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';


export const selectAuthState = createFeatureSelector<AuthState>('auth');


export const selectUserExists = createSelector(
  selectAuthState,
  (state) => state.member
);

export const selectMember = createSelector(
  selectAuthState,
  (state) => state.member
);





