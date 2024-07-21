import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  products: any[] = [
    { setCount: 0, repCount: 0, description: '' },
    { setCount: 0, repCount: 0, description: '' },
    { setCount: 0, repCount: 0, description: '' }
  ];

  constructor() {}

  ngOnInit(): void {}

  onSetCountChange(index: number): void {
    // Handle the change event for the input number field
    console.log(`Set count changed for product at index ${index}: ${this.products[index].setCount}`);
  }

  onRepCountChange(index: number): void {
    console.log(`Rep count changed for row ${index}:`, this.products[index].repCount);
  }

  onDescriptionChange(index: number): void {
    console.log(`Description changed for row ${index}:`, this.products[index].description);
  }
}
