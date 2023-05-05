import { Product } from './product';

export class Invoice {
  customerName: string='';
  address: string='';
  contactNo: number=0;
  email: string='';
  
  products: Product[] = [];
  additionalDetails: string='';

  constructor() {
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}

