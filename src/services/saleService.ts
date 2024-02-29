import config from "config";

import Products from "../models/productModel";
import RefAffiliate from "../models/refAfiliateModel";
import Sales from "../models/saleModel";
import Users from "../models/userModel";

const saleService = {
  createSale: async (ref: string, secret: string) => {
    const refAfiliate = await RefAffiliate.findOne({ ref });
    const realSecret = config.get<string>("secretRef");

    if (secret !== realSecret) {
      throw new Error("Segredo inválido");
    }

    if (!refAfiliate) {
      throw new Error("Ref de compra inválido");
    }

    const newSale = await Sales.create({
      refAfiliate,
    });

    if (!newSale) {
      throw new Error("Erro ao criar venda");
    }

    const user = await Users.findById(refAfiliate.user);

    if (!user) {
      throw new Error(
        "Criamos a compra mas tivemos problemas em vinclular com a sua conta, por favor entre em contato com um administrador"
      );
    }

    user.sales?.push(newSale._id);

    const product = await Products.findById(refAfiliate.product);

    if (!product) {
      throw new Error(
        "Criamos a compra mas tivemos problemas em vinclular com o produto, os administradores ja foram acionados"
      );
    }
    console.log("tem que dar");
    user.saldo = user.saldo + product.comission;

    product.sales?.push(newSale._id);
    product.save();
    user.save();
    //ENVIAR EMAIL PARA O USUÁRIO AVISANDO QUE FOI FEITA UMA NOVA VENDA

    return newSale;
  },

  findAllSalesUser: async (userId: string) => {
    const user = await Users.findById(userId);

    if (!user) {
      throw new Error("erro ao pegar usuário");
    }

    const refAfiliates = await RefAffiliate.find({ user: user._id });

    if (!refAfiliates) {
      throw new Error("Erro ao pegar afiliados");
    }

    const sales = await Sales.find({
      refAfiliate: { $in: refAfiliates },
    }).populate({
      path: "refAfiliate",
      populate: {
        path: "product",
        model: "Products",
      },
    });

    if (!sales) {
      throw new Error("Erro ao pegar vendas");
    }

    if (sales.length <= 0) {
      console.log(sales);
      throw new Error("Ops! Nenhuma venda ainda!");
    }

    return sales;
  },
};

export default saleService;
