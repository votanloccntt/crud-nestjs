import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  getProducts(): string {
    return 'GET LIST PRODUCTS';
  }

  createProduct(): string {
    return 'CREATE PRODUCT';
  }

  detailProduct(): string {
    return 'DETAIL PRODUCT';
  }

  updateProduct(): string {
    return 'UPDATE PRODUCT';
  }

  deleteProduct(): string {
    return 'DELETE PRODUCT';
  }
}
