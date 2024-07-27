import { Component, OnInit ,EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  someData: any; 
  products: { setCount: number, repCount: number, description: string }[] = [];

  constructor() {
    this.products.push({ setCount: 1, repCount: 0, description: '' });
    console.log(this.products);
  }
  addRow() {
    const newRow = {
      setCount: this.products.length + 1, // Example logic for setCount
      repCount: 0,
      description: ''
    };
    this.products.push(newRow);
    console.log(this.products);
  }

  ngOnInit(): void {}

  onSetCountChange(index: number): void {
    // Handle the change event for the input number field
   
    console.log(`Set count changed for product at index ${index}: ${this.products[index].setCount}`);
  }

  onRepCountChange(index: number): void {
    console.log(`Rep count changed for row ${index}:`, this.products[index].repCount);
  }

  onDescriptionChange(index: any): void {
    console.log(`Description changed for row ${index}:`, this.products[index].description);
  }
}
