import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Workout } from '../../Service/workout.service';
import { GetMemberWorkoutStatus } from '../../class/helpClass';
import { PartCount } from '../../interfaces/interface';
import { Observable } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrls: ['./my-chart.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
})
export class MyChartComponent implements OnInit {
  public datas: any;
  public labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  public data: any;
  public chart: any;
  public charts: any;

  constructor(private work: Workout, private getMemberWorkout: GetMemberWorkoutStatus) { }

  ngOnInit(): void {
    this.WorkoutStatus().then(() => {
      this.chart = new Chart('myChart', {
        type: 'bar',
        data: this.WorkoutTrack(),
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      });
      this.charts = new Chart('myChart2', {
        type: 'doughnut',
        data: this.datas,
      });
    });
  }

  public WorkoutTrack(): any {
    this.data = {
      labels: this.labels,
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }]
    };
    return this.data;
  }

  public async WorkoutStatus(): Promise<void> {
    const userId = sessionStorage.getItem('userId');
   
    if (userId !== null) {
      this.getMemberWorkout.userId = userId;
      let monthlyMemberWorkoutStatus: Observable<PartCount[]> = this.work.getMemberWorkoutStatus(userId);

      return new Promise<void>((resolve, reject) => {
        monthlyMemberWorkoutStatus.subscribe(
          (data: PartCount[]) => {
            // Handle the data here
            console.log('Workout Status Data:', data);
            const labels: string[] = [];
            const chartData: number[] = [];
        
            // Populate arrays using a loop
            data.forEach(item => {
              labels.push(item.part);
              chartData.push(item.totalCount);
            });

            this.datas = {
              labels: labels,
              datasets: [{
                label: 'My Monthly Workout Data',
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
}
