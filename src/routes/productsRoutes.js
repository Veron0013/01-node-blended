import { Router } from 'express';

import {
  getProducts,
  getProductById,
} from '../controllers/productsController.js';

const router = Router();

router.get('/products', getProducts);

router.get('/products/:productId', getProductById);

export default router;
