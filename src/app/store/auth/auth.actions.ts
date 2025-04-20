import { createAction, props } from '@ngrx/store';
import { AuthResponse } from '../../models/authResponse.models';

export const checkUserExists = createAction(  '[Auth] Check User Exists', props<{ userId: string }>() );
export const checkUserExistsSuccess  = createAction('[Auth] Check User Exists Success', props<{exists : boolean}>() );
export const checkUserExistsFail  = createAction('[Auth] Check User Exists Fail', props<{fail : any}>() );