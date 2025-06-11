import Order from '../models/order.js';

export async function getOrders() {
    try {
        const orders = await Order.find();
        return orders;
    } catch (error) {
        console.log('getOrders error:', error.message);
        return null;
    }
}

export async function getOrdersByUserId(userId) {
    try {
        const orders = await Order.find({ userId });
        return orders;
    } catch (error) {
        console.log('getOrdersByUserId error:', error.message);
        return null;
    }
}

export async function createOrder(order) {
    try {
        const result = await Order.create(order);  // Viktigt med await här
        return result;
    } catch (error) {
        console.log('createOrder error:', error.message);
        return null;
    }
}
