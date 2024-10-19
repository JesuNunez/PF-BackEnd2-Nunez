import productRepository from "../repository/products.repository.js";

class ProductService {
    async getProducts(options) {
        return await productRepository.getProducts(options);
    }

    async getProductById(id) {
        return await productRepository.getProductById(id);
    }

    async addProduct(productData) {
        return await productRepository.addProduct(productData);
    }

    async updateProduct(id, productData) {
        return await productRepository.updateProduct(id, productData);
    }

    async deleteProduct(id) {
        return await productRepository.deleteProduct(id);
    }
}

export default new ProductService();