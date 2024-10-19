import ProductModel from "./models/product.model.js";

class ProductDAO {
    async getProducts({ limit, page, sort, query }) {
        const options = { limit, page, sort: sort ? { [sort]: 1 } : null };
        return await ProductModel.paginate(query ? { category: query } : {}, options);
    }

    async getProductById(id) {
        return await ProductModel.findById(id);
    }

    async addProduct(productData) {
        return await ProductModel.create(productData);
    }

    async updateProduct(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();