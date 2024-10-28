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
    selectPart : string,
    selectdate : string,
    selectExerciseDescription :string
  }
  export interface WorkoutInfo{
    setCount: number;
    repCount: number;
    weight : number,
    description: string;
  }
  export interface WorkoutSetDTO {
    CreationDate: string; // Change type to string
    ExpirationDate: string; // Change type to string
    LastModified: string; // Change type to string
    MemberId: number;
    Part: string;
    RepCount: number;
    SetCount: number;
    Weight: number;
    SetDescription: string;
}

export interface PartCount {
  part: string;
  totalCount: number;
}
export interface YearCount {
  year: number;
  yearCount: number;
}
export interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
export interface UploadImage{
  memberId :number,
  formData :FormData | null
}
export interface ShareBoardImages{
  shareBoardId: number;
  memberId: number;
  profileImage: string; // This should be a base64 string including the MIME type
  likeImage?: boolean;
  creationDate: string;
  expirationDate: string;
  lastModified: string;
}
export interface ImageLike{
  ShareBoardId: number;
  MemberId: number;
  ImageLike: number; 

}




