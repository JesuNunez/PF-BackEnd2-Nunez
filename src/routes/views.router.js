import express from "express";
const router = express.Router();
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
import passport from "passport";
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para el formulario de login:
router.get("/login", (req, res) => {
    if (req.session?.login) {
        return res.redirect("/products");
    }
    res.render("login");
});

// Ruta para el formulario de Register:
router.get("/register", (req, res) => {
    if (req.session?.login) {
        return res.redirect("/products");
    }
    res.render("register");
});

// Ruta para el formulario de Perfil:
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("profile", {
        first_name: req.user.first_name,
        user: req.user,
    });
});
//Me traigo los Middleware de auth:
import { soloAdmin, soloUser } from "../middleware/auth.js";

// Enviamos al usuario a la vista de Productos:
router.get("/products", passport.authenticate("jwt", { session: false }), soloUser, async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        const nuevoArray = productos.docs.map((producto) => {
            const { _id, ...rest } = producto.toObject();
            return { _id: _id.toString(), ...rest };
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages,
            user: req.user,
            cartId: req.user.cart._id, // Se agrega el usuario autenticado a la vista
        });
        console.log(req.user);
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor",
        });
    }
});

router.get("/products", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.render("products", { user: req.user });
});

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), soloAdmin, (req, res) => {
    res.render("realtimeproducts");
});

// Ruta para obtener productos en tiempo real:
//router.get("/realtimeproducts", async (req, res) => {
//    res.render("realtimeproducts");
//});

// Ruta para eliminar productos:
router.get("/deleteProducts", (req, res) => {
    res.render("deleteProducts");
});

// Ruta para la página de inicio:
router.get("/", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) return next(err); // Manejo de errores
        if (!user) {
            res.render("login");
        } else {
            req.user = user; // Asigna el usuario autenticado a req.user
            res.render("home", {
                first_name: user.first_name,
                user: user,
            });
        }
    })(req, res, next);
});

// Ruta para ver un carrito específico:
router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map((item) => ({
            product: item.product.toObject(),
            quantity: item.quantity,
        }));

        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para crear un carrito:
router.get("/createCart", (req, res) => {
    res.render("createCart");
});

// Ruta para eliminar un carrito:
router.get("/deleteCart", (req, res) => {
    res.render("deleteCart");
});

// Nueva ruta para listar carritos:
router.get("/listCarts", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("listCarts", {
        cartId: req.user.cart._id,
    });
});

export default router;