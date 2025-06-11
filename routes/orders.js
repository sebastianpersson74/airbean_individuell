import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { validateOrderBody } from '../middlewares/validators.js';
import { deleteCart, getCart } from '../services/cart.js';
import { createOrder, getOrders, getOrdersByUserId } from '../services/orders.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        const orders = await getOrders();
        if (orders) {
            res.json({ success: true, orders });
        } else {
            next({ status: 404, message: 'No orders found' });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/:userId', authMiddleware, async (req, res, next) => {
    try {
        if (req.user.userId !== req.params.userId && !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const orders = await getOrdersByUserId(req.params.userId);
        if (orders) {
            res.json({ success: true, orders });
        } else {
            next({ status: 404, message: 'No orders found' });
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', authMiddleware, validateOrderBody, async (req, res, next) => {
    try {
        const { cartId, note } = req.body;
        const cart = await getCart(cartId);
        if (!cart) {
            return next({ status: 400, message: 'The requested cart does not exist' });
        }

        if (cart.userId !== req.user.userId && !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        let price = 0;
        cart.items.forEach(item => {
            price += item.qty * item.price;
        });

        const order = await createOrder({
            orderId: `order-${uuid().substring(0, 5)}`,
            userId: cart.userId,
            items: cart.items,
            price,
            note: note || ''
        });

        if (order) {
            const deleted = await deleteCart(cartId);
            if (deleted) {
                res.status(201).json({
                    success: true,
                    message: 'Order created successfully',
                    order,
                });
            } else {
                next({ status: 400, message: 'Order could not be created' });
            }
        } else {
            next({ status: 400, message: 'Order could not be created' });
        }
    } catch (error) {
        next(error);
    }
});

export default router;
