import { Component, OnInit } from '@angular/core';
import "primeicons/primeicons.css";
import { GetImage } from '../../Service/images.service';
import { AuthService } from '../../Service/auth.service';
import { Observable } from 'rxjs';
import { ShareBoardImages } from '../../interfaces/interface';


@Component({
  selector: 'app-get-member-image',
  templateUrl: './get-member-image.component.html',
  styleUrl: './get-member-image.component.css'
})
export class GetMemberImageComponent {
  public currentMemberId : string = '';
  public memberImages : ShareBoardImages[] = [];
  public imageUrls: string[] = []; 
  public test: number =0; 

  constructor(private auth: AuthService,private image : GetImage) { 
    
  }

  ngOnInit(): void {
    const memberId: string = sessionStorage.getItem('userId') || '';

    if (memberId) {
      this.loadMemberImages(memberId);
    } else {
      console.error('No member ID found in session.');
    }
  }

  private loadMemberImages(memberId: string): void {
    this.auth.getMemberIdByUserID(memberId).subscribe(
      (fetchedMemberId: string) => {
        this.currentMemberId = fetchedMemberId;
        console.log('Current Member ID:', fetchedMemberId);
  
        this.image.getMemberImage(Number(fetchedMemberId)).subscribe(
          (images: ShareBoardImages[] | undefined) => {
            if (!images || images.length === 0) {
        
              console.log('No images found for this member.');
              this.memberImages = []; // Set to an empty array if no images are found
           
            } else {
              console.log('TEST',images);
              this.memberImages = images;
            
           
            }
          },
          (error) => this.handleError('Error fetching images', error)
        );
      },
      (error) => this.handleError('Error fetching member ID', error)
    );
  }
  
  
  


  private handleError(message: string, error: any): void {
    console.error(message, error);
  }
}

