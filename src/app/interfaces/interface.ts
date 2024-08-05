import { Time } from "@angular/common";

export interface Login{
    userId : '',
    password : ''
  } ;
  export interface AuthResponse {
    success: boolean;
    message?: string;
  }

  export interface WorkoutData{
    selectPart? : string,
    selectdate? : string,
    selectTime? : string,
    selectExerciseDescription? :string
  }

  export interface WorkoutInfo{
    setCount: number;
    repCount: number;
    description: string;
  }
  export interface WorkoutSet{
    memberId : number,
    part : string,
    setCount : number,
    repCount :number,
    SetDescription :string,
    CreationDate: Date  //

  }