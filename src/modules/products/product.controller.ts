import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('products')
export class ProductController {
  @Get()
  getProducts(): string {
    return 'GET LIST PRODUCTS';
  }

  @Post()
  createProduct(): string {
    return 'CREATE PRODUCT';
  }

  @Get('/:id')
  detailProduct(): string {
    return 'DETAIL PRODUCT';
  }

  @Put('/:id')
  updateProduct(): string {
    return 'UPDATE PRODUCT';
  }

  @Delete('/:id')
  deleteProduct(): string {
    return 'DELETE PRODUCT';
  }
}
