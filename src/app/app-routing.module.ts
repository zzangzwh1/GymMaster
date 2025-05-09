import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { WorkoutComponent } from './workout/workout.component';
import { ShareComponent } from './share/share.component';
import { EditComponent } from './edit/edit.component';
import { PasswordComponent } from './authentication/password/password.component';


const routes: Routes = [{path:'Authentication',component:AuthenticationComponent},
  {path:'Home',component:HomeComponent},
  {path:'Authentication/signup',component:SignupComponent},
  {path:'Workout',component:WorkoutComponent},
  {path:'share',component:ShareComponent},
  {path:'Edit',component:EditComponent},
  { path: 'password', component: PasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
