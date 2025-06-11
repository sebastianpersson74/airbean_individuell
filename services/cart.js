import Cart from '../models/cart.js';

async function getOrCreateCart(userId) {
    try {
        let cart = await Cart.findOne({ cartId: userId });
        if (!cart) {
            cart = await Cart.create({
                cartId: userId,
                items: []
            });
            console.log('Cart created:', cart);
        }
        return cart;
    } catch (error) {
        console.log('getOrCreateCart error:', error.message);
        return null;
    }
}

export async function updateCart(userId, product) {
    try {
        let cart = await getOrCreateCart(userId);
        if (!cart) {
            throw new Error("Cart not found or could not be created");
        }

        const item = cart.items.find(item => item.prodId === product.prodId);
        if (item) {
            item.qty = product.qty;
        } else {
            cart.items.push(product);
        }

        // Ta bort produkt om qty är 0
        if (product.qty === 0) {
            cart.items = cart.items.filter(item => item.prodId !== product.prodId);
        }

        await cart.save();
        return cart;
    } catch (error) {
        console.log('updateCart error:', error.message);
        return null;
    }
}

export async function getCarts() {
    try {
        const carts = await Cart.find();
        return carts;
    } catch (error) {
        console.log('getCarts error:', error.message);
        return null;
    }
}

export async function getCart(cartId) {
    try {
        const cart = await Cart.findOne({ cartId });
        return cart;
    } catch (error) {
        console.log('getCart error:', error.message);
        return null;
    }
}

export async function deleteCart(cartId) {
    try {
        const result = await Cart.deleteOne({ cartId });
        return result.deletedCount > 0;
    } catch (error) {
        console.log('deleteCart error:', error.message);
        return false;
    }
}
