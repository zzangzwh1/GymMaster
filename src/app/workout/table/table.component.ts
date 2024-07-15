import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',

  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit  {
  products = [
    { code: 'P001', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: 'P002', name: 'Product 2', category: 'Category 2', quantity: 20 },
    { code: 'P003', name: 'Product 3', category: 'Category 3', quantity: 30 }
  ];

  constructor() {
  
  }

  ngOnInit() {
  
  }
}

