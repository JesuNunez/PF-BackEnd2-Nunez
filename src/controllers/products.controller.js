import productService from "../services/products.service.js";

class ProductController {
    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const productos = await productService.getProducts({ limit, page, sort, query });
            res.json({
                status: "success",
                payload: productos,
                totalPages: productos.totalPages,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                page: productos.page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
            });
        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({ status: "error", error: "Error interno del servidor" });
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const producto = await productService.getProductById(id);
            if (!producto) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            res.json(producto);
        } catch (error) {
            console.error("Error al obtener producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async addProduct(req, res) {
        const nuevoProducto = req.body;
        try {
            await productService.addProduct(nuevoProducto);
            res.status(201).json({ message: "Producto agregado exitosamente" });
        } catch (error) {
            console.error("Error al agregar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateProduct(req, res) {
        const id = req.params.pid;
        const productoActualizado = req.body;
        try {
            await productService.updateProduct(id, productoActualizado);
            res.json({ message: "Producto actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            await productService.deleteProduct(id);
            res.json({ message: "Producto eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default new ProductController();