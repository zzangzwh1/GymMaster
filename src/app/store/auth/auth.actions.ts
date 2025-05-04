import { createAction, props } from '@ngrx/store';
import { AuthResponse } from '../../models/authResponse.models';
import { MemberDTO } from '../../interfaces/interface';

export const checkUserExists = createAction(  '[Auth] Check User Exists', props<{ userId: string }>() );
export const checkUserExistsSuccess = createAction('[Auth] Check User Exists Success', props<{ member: MemberDTO | null }>());  
export const checkUserExistsFail = createAction('[Auth] Check User Exists Fail',    props<{ error: any }>());
    
export const getMemberById = createAction('[Auth] Get Member', props<{ userId: string }>());
export const getMemberByIdSuccess = createAction('[Auth] Get Member Success', props<{ member: MemberDTO | null }>());
export const getMemberByIdFail = createAction('[Auth] Get Member Fail', props<{ error: any }>());
