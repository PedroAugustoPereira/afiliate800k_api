import express from "express";

import saleController from "../controllers/saleController";
import desserializeUser from "../middlewares/desserializeUser";
import { requireUser } from "../middlewares/requireUser";

const saleRouter = express.Router();

saleRouter.post("/newSale", saleController.newSale);
saleRouter.get(
  "/salesUser",
  desserializeUser,
  requireUser,
  saleController.getSalesForUser
);

export default saleRouter;
