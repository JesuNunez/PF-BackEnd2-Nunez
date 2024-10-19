import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-db.js";
import CartModel from "../dao/models/cart.model.js";
import CartController from "../controllers/cart.controller.js";
import ProductModel from "../dao/models/product.model.js";
import UsuarioModel from "../dao/models/users.model.js";
import TicketModel from "../dao/models/tickets.model.js";
import { calcularTotal } from "../util/util.js";
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", CartController.createCart);

// Obtener los productos de un carrito
router.get("/:cid", CartController.getCartProducts);

// Agregar productos a un carrito
router.post("/:cid/product/:pid", CartController.addProductToCart);

// Obtener todos los carritos
router.get("/", CartController.getAllCarts);

// Eliminar un carrito
router.delete("/:cid", CartController.deleteCart);

// Eliminar un producto de un carrito
router.delete("/:cid/product/:pid", CartController.deleteProductFromCart);

// Actualizar un carrito
router.put("/:cid", CartController.updateCart);

// Actualizar cantidad de productos en un carrito
router.put("/:cid/products/:pid", CartController.updateProductQuantity);


router.get("/:cid/purchase", async (req, res) => {
    const carritoId = req.params.cid;
    try {
        const carrito = await CartModel.findById(carritoId);
        if (!carrito) {
            return res.status(404).send("Carrito no encontrado");
        }

        const arrayProductos = carrito.products;
        const productosNoDisponibles = [];
        const productosComprados = [];

        for (const item of arrayProductos) {
            const productId = item.product;
            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).send(`Producto con ID ${productId} no encontrado`);
            }
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                productosComprados.push(item);
            } else {
                productosNoDisponibles.push(item);
            }
        }

        const usuarioDelCarrito = await UsuarioModel.findOne({ cart: carritoId });
        if (!usuarioDelCarrito) {
            return res.status(404).send("Usuario no encontrado para el carrito");
        }

        if (!usuarioDelCarrito.email) {
            return res.status(400).send("El usuario no tiene un email asociado");
        }

        const ticket = new TicketModel({
            purchase_datetime: new Date(),
            amount: calcularTotal(productosComprados),
            purchaser: usuarioDelCarrito.email,
        });

        await ticket.save();

        res.json({
            message: "Compra generada",
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
                purchase_datetime: ticket.purchase_datetime
            },
        });
    } catch (error) {
        console.error("Error al generar ticket:", error);  // Agregar log para ver el error exacto
        res.status(500).send("Error del servidor al crear ticket");
    }
});


export default router;