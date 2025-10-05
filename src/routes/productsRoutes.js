import { Router } from 'express';

import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from '../controllers/productsController.js';

const router = Router();

router.get('/products', getProducts);

router.get('/products/:productId', getProductById);

router.post('/products', createProduct);

router.patch('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

export default router;
