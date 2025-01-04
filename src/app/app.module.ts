import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WorkoutComponent } from './workout/workout.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';  
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableComponent } from './workout/table/table.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';;
import { CardModule } from 'primeng/card';
import { MyChartComponent } from './home/my-chart/my-chart.component';
import { GetMemberWorkoutStatus } from './class/helpClass';
import { ShareComponent } from './share/share.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HelperComponent } from './helper/helper.component';
import { EditComponent } from './edit/edit.component';
import { PasswordComponent } from './authentication/password/password.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AuthenticationComponent,
    HomeComponent,
    SignupComponent,
    WorkoutComponent,
    TableComponent,
    MyChartComponent,
    ShareComponent,
    HelperComponent,
    EditComponent,
    PasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    TableModule, 
    CommonModule,
    CardModule,
    FileUploadModule,
    ToastModule

   
  
  ],
  providers: [
    provideAnimationsAsync(),GetMemberWorkoutStatus,MessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Add this line
  bootstrap: [AppComponent]
})
export class AppModule { }
