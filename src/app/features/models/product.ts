export class Product {
    name: string;
    price: number;
    qty: number;
    
    constructor(name?: string, price?: number, qty?: number) {
      this.name = name || '';
      this.price = price || 0;
      this.qty = qty || 0;
    }
  }
  