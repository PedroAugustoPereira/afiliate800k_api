import generateUniqueCode from '../middlewares/generateUniqueCode';
import Products from '../models/productModel';
import RefAffiliate from '../models/refAfiliateModel';
import Users from '../models/userModel';

const productService = {
  createProduct: async (
    name: string,
    checkout: string,
    price: number,
    comission: number,
    description: string,
    imageMain: string | null,
    imageEmpire: string | null,
    createdByUser: string
  ) => {
    const user = await Users.findById(createdByUser);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const newProduct = await Products.create({
      name,
      price,
      checkout,
      comission,
      description,
      imageMain: imageMain,
      imageEmpire: imageEmpire,
      createdByUser,
    });
    user.products?.push(newProduct._id);
    await user.save();

    return newProduct;
  },

  getProducts: async () => {
    const products = await Products.find().select(
      "name price comission imageMain _id description"
    );

    return products;
  },

  getOne: async (id: string, userId: string) => {
    const product = await Products.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    const refAffiliate = await RefAffiliate.findOne({
      user: userId,
      product: id,
    });

    // Se o usuário for afiliado, adicionar o ref ao produto
    const productObj = product.toObject();

    if (refAffiliate) {
      return {
        ...productObj,
        ref: refAffiliate.ref,
      };
    }

    return product;
  },

  createAfiliate: async (idProduct: string, idUser: string) => {
    const product = await Products.findById(idProduct);
    if (!product) {
      throw new Error("Product not found");
    }

    const user = await Users.findById(idUser);

    if (!user) {
      throw new Error("Usuário inválido");
    }

    const isAfiliated = product.affiliates?.includes(user._id);

    if (isAfiliated) {
      throw new Error("Usuário ja é afiliado!");
    }

    const code = generateUniqueCode(user.email);

    const newRefAfiliate = await RefAffiliate.create({
      ref: code,
      user: user._id,
      product: product._id,
    });

    if (!newRefAfiliate) {
      throw new Error("Erro ao adicionar como afiliado!");
    }

    product.affiliates?.push(user._id);
    user.refAfiliate?.push(newRefAfiliate._id);

    product.save();
    user.save();
    newRefAfiliate.save();

    return code;
  },
};

export default productService;
