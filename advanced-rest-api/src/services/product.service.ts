import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../models/product.model';
import { AppError } from '../utils/AppError';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async createProduct(product: Product): Promise<Product> {
    return this.productRepository.create(product);
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.update(id, productData);
    if (!product) {
      throw new AppError('Product not found or update failed', 404);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const success = await this.productRepository.delete(id);
    if (!success) {
      throw new AppError('Product not found', 404);
    }
  }
}
