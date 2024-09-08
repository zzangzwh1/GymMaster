import { Component, OnInit } from '@angular/core';
import "primeicons/primeicons.css";
import { GetImage } from '../Service/images.service';
import { AuthService } from '../Service/auth.service';
import { Observable } from 'rxjs';
import { ShareBoardImages } from '../interfaces/interface';



@Component({
  selector: 'app-get-images',
  templateUrl: './share.component.html',
  styleUrl: './share.component.css'
})
export class ShareComponent implements OnInit {

  public currentMemberId : string = '';
  public memberImages : ShareBoardImages[] = [];
  public imageUrls: string[] = []; 
  public test: number =0; 

  constructor(private auth: AuthService,private image : GetImage) { 
    
  }

  ngOnInit(): void { 
    this.loadMemberImages();
  }

  private loadMemberImages(): void {
    this.image.getImages().subscribe(
      (images: ShareBoardImages[] | undefined) => {
        if (!images || images.length === 0) {
          console.log('No images found for this member.');
          this.memberImages = []; // Set to an empty array if no images are found
        } else {
          console.log('TEST', images);
          this.memberImages = images;
        }
      },
      (error) => this.handleError('Error fetching images', error) // Correctly placed error callback
    );
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
  }
}

