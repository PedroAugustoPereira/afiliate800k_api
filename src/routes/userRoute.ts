import express from "express";
import multer from "multer";

import userController from "../controllers/userController";
import { desserializeUser } from "../middlewares/desserializeUser";
import uploadsConfig from "../middlewares/multer";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from "../middlewares/restrictTo";

const userRouter = express.Router();
const upload = multer(uploadsConfig);
const productRouter = express.Router();

//middlewares que excutam antes de cada chamada de rota.
userRouter.use(desserializeUser, requireUser);

//PRIVATE ROUTES ADMIN
userRouter.get("/", restrictTo("admin"), userController.getAllUsersHandler);

userRouter.post("/setPerfil", upload.single("image"), userController.setPerfil);
userRouter.put("/setNotFirstTime", userController.firstTime);
userRouter.put(
  "/updateUser",
  upload.single("image"),
  userController.userUpdate
);
userRouter.put("/saldoFicticio", userController.saldoFicticioUpdate);

userRouter.get("/productsAfiliated", userController.getProductsAfiliateds);

//PUBLIC GET ROUTES
userRouter.get("/me", userController.getMe);

export default userRouter;
