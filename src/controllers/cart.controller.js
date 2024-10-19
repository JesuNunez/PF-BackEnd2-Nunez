import cartService from "../services/cart.service.js";

class CartController {
    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.json(newCart);
        } catch (error) {
            console.error("Error al crear un nuevo carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getCartProducts(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getCartProducts(cartId);
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(cart.products);
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
            res.json(updatedCart.products);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllCarts(req, res) {
        try {
            const carts = await cartService.getAllCarts();
            res.json(carts);
        } catch (error) {
            console.error("Error al obtener los carritos", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getCartById(req, res) {
        try {
            const carts = await cartService.getCartById(req.cartId);
            res.json(carts);
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    async deleteCart(req, res) {
        const cartId = req.params.cid;
        try {
            const result = await cartService.deleteCart(cartId);
            if (!result) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json({ message: "Carrito eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartService.deleteProductFromCart(cartId, productId);
            if (updatedCart) {
                res.json({ message: "Producto eliminado del carrito exitosamente", carrito: updatedCart });
            } else {
                res.status(404).json({ error: "Carrito o producto no encontrado" });
            }
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateCart(req, res) {
        const cartId = req.params.cid;
        const products = req.body.products;
        try {
            const updatedCart = await cartService.updateCart(cartId, products);
            if (!updatedCart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json({ message: "Carrito actualizado exitosamente", carrito: updatedCart });
        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
        }
        try {
            const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
            if (!updatedCart) {
                return res.status(404).json({ error: "Carrito o producto no encontrado" });
            }
            res.json({ message: "Cantidad de producto actualizada exitosamente", carrito: updatedCart });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default new CartController();