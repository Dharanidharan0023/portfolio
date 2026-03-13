import { Product } from '../models/product.model';

// In-memory mock repository
export class ProductRepository {
  private products: Product[] = [
    {
      id: 'e0e0e0e0-e0e0-4e0e-a0e0-e0e0e0e0e0e1',
      name: 'Modern Laptop',
      description: 'High performance laptop for development',
      price: 1299.99,
      category: 'Electronics',
      createdAt: new Date(),
    },
  ];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) || null;
  }

  async create(product: Product): Promise<Product> {
    const newProduct = { ...product, id: crypto.randomUUID(), createdAt: new Date() };
    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
}
