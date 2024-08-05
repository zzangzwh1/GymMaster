import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public username :string = '';
  constructor(
    private titleService: Title
  ) { 
    titleService.setTitle('Home');
  }
  ngOnInit(): void {
    const currentUser = sessionStorage.getItem('userId');
    // if(currentUser != null)
    //   {
    //    this.username = 
    //   }
      console.log('Test');
    
  }
 


}
