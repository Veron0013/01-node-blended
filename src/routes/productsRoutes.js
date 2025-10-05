import { Router } from 'express';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from '../controllers/productsController.js';

const router = Router();

router.get('/products', getProducts);

router.get('/products/:productId', getProductById);

router.post('/products', createProduct);

router.patch('/products/:productId', updateProduct);

export default router;
