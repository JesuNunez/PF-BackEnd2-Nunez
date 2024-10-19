import cartRepository from "../repository/cart.repository.js";

class CartService {
    async createCart() {
        return await cartRepository.createCart();
    }

    async getCartProducts(cartId) {
        return await cartRepository.getCartById(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await cartRepository.addProductToCart(cartId, productId, quantity);
    }

    async getAllCarts() {
        return await cartRepository.getAllCarts();
    }

    async getCartById(cartId) {
        return await cartRepository.getCartById(cartId);
    }

    async deleteCart(cartId) {
        return await cartRepository.deleteCart(cartId);
    }

    async deleteProductFromCart(cartId, productId) {
        return await cartRepository.deleteProductFromCart(cartId, productId);
    }

    async updateCart(cartId, products) {
        return await cartRepository.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await cartRepository.updateProductQuantity(cartId, productId, quantity);
    }
}

export default new CartService();