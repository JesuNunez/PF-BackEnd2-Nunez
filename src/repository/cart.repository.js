import CartDao from "../dao/cart.dao.js";

class CartRepository {
    async createCart() {
        return await CartDao.create();
    }

    async getCartById(cartId) {
        return await CartDao.findCartById(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await CartDao.addProductToCart(cartId, productId, quantity);
    }

    async getAllCarts() {
        return await CartDao.find();
    }
    async deleteCart(cartId) {
        return await CartDao.findByIdAndDelete(cartId);
    }

    async deleteProductFromCart(cartId, productId) {
        return await CartDao.removeProductFromCart(cartId, productId);
    }

    async updateCart(cartId, products) {
        return await CartDao.findByIdAndUpdate(cartId, { products }, { new: true });
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await CartDao.findOneAndUpdate(
            { _id: cartId, "products.productId": productId },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
        );
    }
}

export default new CartRepository();