import { NextFunction, Request, Response } from "express";

import featuredProductsService from "../services/featuredProductsService";

const featuredProductController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;
      console.log(productId);

      const requestImage = req.file as Express.Multer.File;
      const imageFeatured = requestImage.filename;

      const featuredProduct = await featuredProductsService.create(
        productId,
        imageFeatured
      );

      if (!featuredProduct) {
        return res
          .status(400)
          .json({ status: false, message: "erro ao criar" });
      }

      res.status(200).json({ status: true, data: featuredProduct });
    } catch (err: any) {
      res.status(400).json({
        status: false,
        message: err.message,
      });
    }
  },

  getFeaturedsProducts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = await featuredProductsService.getAll();

      if (!products) {
        return res
          .status(400)
          .json({ status: false, message: "erro ao pegar produtos" });
      }

      res.status(200).json({ status: true, data: products });
    } catch (err: any) {
      res.status(400).json({
        status: false,
        message: err.message,
      });
    }
  },
};

export default featuredProductController;
