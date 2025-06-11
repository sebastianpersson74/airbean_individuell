import express from 'express';
import Product from '../models/product.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

export async function getProduct(prodId) {
  try {
    return await Product.findOne({ prodId });
  } catch (err) {
    console.error('getProduct error:', err);
    return null;
  }
}

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminMiddleware, async (req, res) => {
  const { title, desc, price } = req.body;
  if (!title || !desc || price === undefined) {
    return res.status(400).json({ message: 'title, desc and price are required' });
  }

  try {
    const newProduct = new Product({
      prodId: uuidv4(),
      title,
      desc,
      price,
      createdAt: new Date(),
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:prodId', adminMiddleware, async (req, res) => {
  const { prodId } = req.params;
  const { title, desc, price } = req.body;
  if (!title || !desc || price === undefined) {
    return res.status(400).json({ message: 'title, desc and price are required' });
  }

  try {
    const product = await Product.findOne({ prodId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.title = title;
    product.desc = desc;
    product.price = price;
    product.modifiedAt = new Date();

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:prodId', adminMiddleware, async (req, res) => {
  const { prodId } = req.params;

  try {
    const product = await Product.findOneAndDelete({ prodId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
