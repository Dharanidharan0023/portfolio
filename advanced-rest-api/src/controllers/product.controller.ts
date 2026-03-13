import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json({ status: 'success', data: products });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProductById(req.params.id as string);
      res.json({ status: 'success', data: product });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({ status: 'success', data: product });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      res.json({ status: 'success', data: product });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
