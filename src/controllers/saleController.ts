import { NextFunction, Request, Response } from "express";

import saleService from "../services/saleService";

const saleController = {
  newSale: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { secret, ref } = req.body;

      if (!ref) {
        return res.status(400).json({
          status: false,
          message: "Ref nulo ou inválido",
        });
      }

      if (!secret) {
        return res.status(401).json({
          status: false,
          message: "segredo inválido",
        });
      }

      const sale = await saleService.createSale(ref, secret);

      if (!sale) {
        return res.status(400).json({
          status: false,
          message: "Ocorreu algum erro ao criar compra",
        });
      }

      return res.status(201).json({
        status: true,
        data: sale,
      });
    } catch (err: any) {
      return res.status(400).json({
        status: false,
        message: err.message,
      });
    }
  },

  getSalesForUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      let sales;

      if (user.role === "admin") {
      } else {
        sales = await saleService.findAllSalesUser(user._id);
      }

      if (!sales) {
        return res.status(400).json({
          status: false,
          message: "Ocorreu algum erro",
        });
      }

      return res.status(200).json({
        status: true,
        data: sales,
      });
    } catch (err: any) {
      return res.status(400).json({
        status: false,
        message: err.message,
      });
    }
  },
};

export default saleController;
