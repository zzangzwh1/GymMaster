import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Workout } from '../../Service/workout.service';
import { GetMemberWorkoutStatus } from '../../class/helpClass';
import { PartCount, YearCount } from '../../interfaces/interface';
import { Observable } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrls: ['./my-chart.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
})
export class MyChartComponent implements OnInit {
  public datas: any;
 public userId =  sessionStorage.getItem('userId');
   
  public data: any;
  public chart: any;
  public charts: any;

  constructor(private work: Workout, private getMemberWorkout: GetMemberWorkoutStatus) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.WorkoutStatus(); 
      await this.WorkoutTrack();
     
      this.chart = new Chart('myChart', {
        type: 'bar',
        data: this.data,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      this.charts = new Chart('myChart2', {
        type: 'doughnut',
        data: this.datas,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                }
              }
            }
          }
        }
      });

    } catch (error) {
      console.error('Error initializing charts:', error);
    }

  }

  public async WorkoutTrack():  Promise<void> {
    if(this.userId !== null){
      let annualMemberWorkoutStatus: Observable<YearCount[]> = this.work.getAnnualWorkoutStatus(this.userId);
      return new Promise<void>((resolve, reject) => {
        annualMemberWorkoutStatus.subscribe(
          (data: YearCount[]) => {
            // Handle the data here
           
            const year: string[] = [];
            const chartData: number[] = [];       
          
            data.forEach(item => {             
              let montName = this.getMonthName(item.year);
              year.push(montName);
              chartData.push(item.yearCount);
            })
          
            this.data = {
              labels: year,
              datasets: [{
                label: 'Member Total Annaul Total Sets Workout',
                data: chartData,
                backgroundColor: [
                 'rgba(255, 99, 132, 0.2)',   // Jan
                 'rgba(255, 159, 64, 0.2)',    // Feb
                 'rgba(255, 205, 86, 0.2)',    // Mar
                 'rgba(75, 192, 192, 0.2)',    // Apr
                 'rgba(54, 162, 235, 0.2)',    // May
                 'rgba(153, 102, 255, 0.2)',   // Jun
                 'rgba(255, 99, 132, 0.2)',    
                 'rgba(255, 159, 64, 0.2)',    
                 'rgba(255, 205, 86, 0.2)',    
                 'rgba(75, 192, 192, 0.2)',    
                 'rgba(54, 162, 235, 0.2)',    
                 'rgba(153, 102, 255, 0.2)'    
                ],
                borderColor: [
                  'rgb(255, 99, 132)',    // Jan
                  'rgb(255, 159, 64)',    // Feb
                  'rgb(255, 205, 86)',    // Mar
                  'rgb(75, 192, 192)',    // Apr
                  'rgb(54, 162, 235)',    // May
                  'rgb(153, 102, 255)',   // Jun
                  'rgb(201, 203, 207)',   
                  'rgb(255, 99, 132)',    
                  'rgb(255, 159, 64)',    
                  'rgb(255, 205, 86)',    
                  'rgb(75, 192, 192)',    
                  'rgb(54, 162, 235)'     
                ],
                borderWidth: 1
              }]
            };

            resolve();
          },
          (error: any) => {
            console.error('Error fetching workout status:', error);
            reject(error);
          }
        );
      });
    } else {
      console.error('User ID is not defined');
      return Promise.reject('User ID is not defined');
    }
  }
 
  public async WorkoutStatus(): Promise<void> {
   
    if (this.userId !== null) {
      this.getMemberWorkout.userId = this.userId;
      let monthlyMemberWorkoutStatus: Observable<PartCount[]> = this.work.getMemberWorkoutStatus(this.userId);

      return new Promise<void>((resolve, reject) => {
        monthlyMemberWorkoutStatus.subscribe(
          (data: PartCount[]) => {
            // Handle the data here
            console.log('Workout Status Data:', data);
            const labels: string[] = [];
            const chartData: number[] = [];        
          
            data.forEach(item => {
              labels.push(item.part);
              chartData.push(item.totalCount);
            });

            this.datas = {
              labels: labels,
              datasets: [{
                label: 'Total Workout Data',
                data: chartData,
                backgroundColor: [
                  'rgb(255, 0, 0)',
                  'rgb(0, 255, 0)',
                  'rgb(0, 0, 255)',
                  'rgb(255, 165, 0)',
                  'rgb(128, 0, 128)'
                ],
                hoverOffset: 4
              }]
            };

            console.log('Datas:', this.datas);
            resolve();
          },
          (error: any) => {
            console.error('Error fetching workout status:', error);
            reject(error);
          }
        );
      });
    } else {
      console.error('User ID is not defined');
      return Promise.reject('User ID is not defined');
    }
  }
  private getMonthName(monthNumber: number): string {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    // Adjust for zero-based index (e.g., 1 maps to 'Jan', 2 maps to 'Feb')
    return monthNames[monthNumber - 1] || 'Unknown';
  }
}
