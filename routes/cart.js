import { Router } from 'express';
import { validateCartBody } from '../middlewares/validators.js';
import { getProduct } from '../services/menu.js';
import { getUser } from '../services/users.js';
import { getCarts, getCart, updateCart, deleteCart } from '../services/cart.js'; // <-- import deleteCart
import { v4 as uuid } from 'uuid';
import authMiddleware from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

const router = Router();

// GET alla kundvagnar – kräver admin
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        const carts = await getCarts();
        if (carts) {
            res.json({ success: true, carts });
        } else {
            next({ status: 404, message: 'No carts found' });
        }
    } catch (error) {
        next(error);
    }
});

// GET en specifik kundvagn – kräver ägarskap eller admin
router.get('/:cartId', authMiddleware, async (req, res, next) => {
    try {
        const cart = await getCart(req.params.cartId);
        if (!cart) {
            return next({ status: 404, message: 'No cart found' });
        }
        if (cart.userId !== req.user.userId && !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        res.json({ success: true, cart });
    } catch (error) {
        next(error);
    }
});

// PUT: Uppdatera eller skapa ny kundvagn
router.put('/', validateCartBody, async (req, res, next) => {
    try {
        const { prodId, qty, guestId } = req.body;

        const product = await getProduct(prodId);
        if (!product) {
            return next({ status: 400, message: 'Invalid prodId provided' });
        }

        let userId;
        if (req.headers.authorization?.startsWith('Bearer ')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            } catch {
                userId = guestId || `guest-${uuid().substring(0, 5)}`;
            }
        } else {
            userId = guestId || `guest-${uuid().substring(0, 5)}`;
        }

        const result = await updateCart(userId, {
            prodId,
            title: product.title,
            price: product.price,
            qty,
        });

        if (result) {
            res.status(201).json({
                success: true,
                message: 'Cart updated',
                cart: result,
                userId,
            });
        } else {
            next({ status: 400, message: 'Could not add to cart' });
        }
    } catch (error) {
        next(error);
    }
});

// DELETE: Ta bort en kundvagn
router.delete('/:cartId', async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const deleted = await deleteCart(cartId);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Cart not found or already deleted' });
        }

        res.json({ success: true, message: 'Cart deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
