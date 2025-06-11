import { Router } from 'express';
import Product from '../models/product.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET: Hämta hela menyn
router.get('/', async (req, res, next) => {
    try {
        console.log('GET /api/menu kallad');
        const menu = await Product.find();
        console.log('Produkter från DB:', menu);
        if (menu && menu.length > 0) {
            res.json({
                success: true,
                menu: menu
            });
        } else {
            console.log('Ingen produkt funnen i DB');
            res.json({
                success: true,
                menu: []
            });
        }
    } catch (error) {
        console.error('Fel vid hämtning av produkter:', error);
        next(error);
    }
});

// POST: Lägg till ny produkt
router.post('/', adminMiddleware, async (req, res, next) => {
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
            createdAt: new Date()
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
});

// PUT: Uppdatera produkt
router.put('/:prodId', adminMiddleware, async (req, res, next) => {
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
    } catch (error) {
        next(error);
    }
});

// DELETE: Ta bort produkt
router.delete('/:prodId', adminMiddleware, async (req, res, next) => {
    const { prodId } = req.params;
    try {
        const product = await Product.findOneAndDelete({ prodId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// Sök efter produkt
router.get('/search', async (req, res, next) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Query parameter is required' });
        }

        const results = await Product.find({
            title: { $regex: query, $options: 'i' }
        });

        res.json({ success: true, products: results });
    } catch (error) {
        next(error);
    }
});

export default router;
