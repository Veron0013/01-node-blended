import createHttpError from 'http-errors';

import {
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductByIdService,
  updateProductService,
} from '../services/productsService.js';

export const getProducts = async (req, res) => {
  const products = await getAllProductService();
  res.status(200).json(products);
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await getProductByIdService(productId);
  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  res.status(200).json(product);
};

export const createProduct = async (req, res) => {
  const product = await createProductService(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await updateProductService(productId, req.body);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  res.status(200).json(product);
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await deleteProductService(productId);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  res.status(200).json(product);
};
