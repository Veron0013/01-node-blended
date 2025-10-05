import createHttpError from 'http-errors';

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};
