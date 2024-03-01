import featuredProducts from "../models/featuredProductsModel";
import Products from "../models/productModel";

const featuredProductsService = {
  create: async (productId: string, imageFeatured: string) => {
    const product = await Products.findById({ productId });

    if (!product) {
      throw new Error("Produto inválido");
    }

    const featuredProduct = await featuredProducts.create({
      imageFeatured,
      product: product._id,
    });

    if (!featuredProduct) {
      throw new Error("Erro ao criar");
    }

    return featuredProduct;
  },

  getAll: async () => {
    const products = await featuredProducts
      .find()
      .populate("product", "name price comission imageEmpire");

    if (!products) {
      throw new Error("Erro pegar produtos");
    }

    return products;
  },
};

export default featuredProductsService;
