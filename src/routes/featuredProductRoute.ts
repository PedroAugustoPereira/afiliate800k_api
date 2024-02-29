import express from "express";
import multer from "multer";

import featuredProductController from "../controllers/featuredProductController";
import desserializeUser from "../middlewares/desserializeUser";
import uploadsConfig from "../middlewares/multer";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";

const upload = multer(uploadsConfig);
const featuredProductRouter = express.Router();

//validação de usuário
featuredProductRouter.use(desserializeUser, requireUser);

featuredProductRouter.post(
  "/newFeaturedProduct",
  restrictTo("admin"),
  upload.single("imageFeatured"),
  // upload.single("imageEmpire"),
  featuredProductController.create
);

featuredProductRouter.get(
  "/",

  // upload.single("imageEmpire"),
  featuredProductController.getFeaturedsProducts
);

// featuredProductRouter.get("/:id", productController.getOneProduct);
// featuredProductRouter.get("/", productController.getProducts);

export default featuredProductRouter;
