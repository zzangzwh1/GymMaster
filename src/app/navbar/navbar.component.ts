import { Component,OnInit  } from '@angular/core';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isNavbarCollapsed = true;
  isLoggedIn = false;
  memberLoggendIn : boolean | null = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/Authentication']);
  }
}
