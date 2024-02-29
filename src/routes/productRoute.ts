import express from "express";
import multer from "multer";

import productController from "../controllers/productController";
import desserializeUser from "../middlewares/desserializeUser";
import uploadsConfig from "../middlewares/multer";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";

const upload = multer(uploadsConfig);
const productRouter = express.Router();

//validação de usuário
productRouter.use(desserializeUser, requireUser);

productRouter.post(
  "/newProduct",
  restrictTo("admin"),
  upload.array("images"),
  // upload.single("imageEmpire"),
  productController.newProduct
);
productRouter.post("/newAfiliate", productController.afiliate);

productRouter.get("/:id", productController.getOneProduct);
productRouter.get("/", productController.getProducts);

export default productRouter;
