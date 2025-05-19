export interface Login{
    userId : '',
    password : ''
  } ;
  export interface AuthResponse {
    success: boolean;
    message?: string;
  }
  export interface MemberDTO {
    memberId :number;
    userId: string;
    password?: string; 
    sex: string;
    firstName: string; 
    lastName: string;
    birthDate?: Date;
    address: string; 
    email: string;
    phone: string; 
   // creationDate: Date;
    //expirationDate: Date;
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
  profileImage: string; 
  likeImage?: boolean;
  creationDate: string;
  expirationDate: string;
  lastModified: string;
}
export interface ImageLike{
  shareBoardId: number;
  userId: string;
  totalCount : number;
}
export interface IResult{
  message: string;
  isSuccess: boolean;

}
/*export interface IImageLikeCountDTO{
  shareBoardId :number;
  totalCount : number;
}*/
export interface boardComment{
  boardCommentId:number;
  shareBoardId: number;
  memberId: string;
  comment :string
}
export interface MemberAndCommentInfoDTO {
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  shareBoardId: number;
  memberId: number;
  comment: string;
  boardCommentId :number;
}
export interface forgotPassword{
  userId:string;
  email :string;
  phone :string;
  selectedValue :string;
}






