import {
  NextFunction,
  Request,
  Response,
} from 'express';

import productService from '../services/productService';

const productController = {
  //depois fazer schema do zod para validar entrada
  newProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;

      if (user.role !== "admin") {
        res.status(403).json({
          status: false,
          message: "O usuário não tem acesso a criação de produtos",
        });
      }

      const createdByUser = user._id;
      let { name, checkout, price, comission, description, images } = req.body;

      price = parseFloat(price);
      comission = parseFloat(comission);

      const moneyRegex = /^\d+(\.\d{2})?$/;
      if (!moneyRegex.test(price) || !moneyRegex.test(comission)) {
        return res.status(400).json({
          status: false,
          message: "valores estão em formato inválido",
        });
      }
      new URL(checkout);

      const requestImage = req.files as Express.Multer.File[];
      console.log(requestImage);

      const imageMain = requestImage[0].filename || null;
      const imageEmpire = requestImage[1].filename || null;

      const product = await productService.createProduct(
        name,
        checkout,
        price,
        comission,
        description,
        imageMain,
        imageEmpire,
        createdByUser
      );
      if (!product) {
        return res.status(400).json({
          status: false,
          message: "Erro ao criar produto",
        });
      }

      res.status(200).json({
        status: true,
        data: product,
      });
    } catch (err: any) {
      res.status(400).json({
        status: false,
        message: err.message,
      });
    }
  },

  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productService.getProducts();

      if (!products) {
        return res
          .status(400)
          .json({ status: false, message: "erro ao pegar produtos" });
      }

      console.log(products);
      res.status(200).json({ status: true, data: products });
    } catch (err: any) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  getOneProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const product = await productService.getOne(id, res.locals.user._id);

      if (!product) {
        return res
          .status(404)
          .json({ status: false, message: "produto não encontradp" });
      }

      res.status(200).json({ status: true, data: product });
    } catch (err: any) {
      res.status(500).json({ status: false, message: err.message });
    }
  },

  afiliate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.body.productId;
      if (!productId) {
        return res
          .status(400)
          .json({ status: false, message: "Produto inválido" });
      }

      const newAfiliate = await productService.createAfiliate(
        productId,
        res.locals.user._id
      );

      if (!newAfiliate) {
        return res
          .status(400)
          .json({ status: false, message: "Ococorreu um erro" });
      }

      return res.status(200).json({ status: true, data: newAfiliate });
    } catch (err: any) {
      res.status(500).json({ status: false, message: err.message });
    }
  },
};

export default productController;
