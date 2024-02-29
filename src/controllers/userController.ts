import { NextFunction, Request, Response } from "express";

import userService from "../services/userService";

interface userUpdate {
  name?: string;
  email?: string;
  imagePerfil?: string;
}

const userController = {
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user; //pegamos o usuario do locals após a verificação de token
      res.status(200).json({
        status: true,
        data: {
          user, //retornamos os dados do usuario sem a senha
        },
      });
    } catch (err: any) {
      next(err);
    }
  },

  getAllUsersHandler: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await userService.findAllUsers();
      res.status(200).json({
        status: true,
        result: users.length,
        data: {
          users,
        },
      });
    } catch (err: any) {
      next(err);
    }
  },

  setPerfil: async (req: Request, res: Response, next: NextFunction) => {
    console.log("chega aqui?");
    try {
      const user = res.locals.user;
      const { name } = req.body;

      const requestImage = req.file as Express.Multer.File;
      let image;
      if (requestImage) {
        image = requestImage.filename;
      } else {
        image = null;
      }

      //crair o perfil
      const perfil = await userService.updatePerfil(name, image, user._id);

      if (!perfil) {
        return res
          .status(400)
          .json({ status: false, message: "erro ao salvar" });
      }

      return res
        .status(200)
        .json({ status: true, message: "salvo com sucesso" });
    } catch (err: any) {
      return res.status(400).json({ status: false, message: err.message });
    }
  },

  firstTime: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;

      const update = await userService.updateUser(
        { firstTime: false },
        user._id
      );

      if (!update) {
        return res
          .status(400)
          .json({ status: false, message: "erro ao salvar" });
      }

      return res
        .status(200)
        .json({ status: true, message: "salvo com sucesso" });
    } catch (err: any) {
      return res.status(400).json({ status: false, message: err.message });
    }
  },

  userUpdate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      const { name, email } = req.body;
      const requestImage = req.file as Express.Multer.File;
      let object = {
        name: name,
        email: email,
      } as userUpdate;

      let image;

      if (requestImage) {
        image = requestImage.filename;
        object.imagePerfil = image;
      }

      const update = await userService.updateUser(object, user._id);

      if (!update) {
        return res
          .status(400)
          .json({ status: false, message: "erro ao salvar" });
      }

      return res
        .status(200)
        .json({ status: true, message: "salvo com sucesso" });
    } catch (err: any) {
      return res.status(400).json({ status: false, message: err.message });
    }
  },

  saldoFicticioUpdate: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { saldoFicticio, fake } = req.body;
      const idUser = res.locals.user._id;

      const att = await userService.updateSaldoFicticio(
        saldoFicticio,
        idUser,
        fake
      );

      if (!att) {
        return res
          .status(400)
          .json({ status: false, message: "erro ao atualizar" });
      }

      return res
        .status(200)
        .json({ status: true, message: "salvo com sucesso", data: att });
    } catch (err: any) {
      return res.status(400).json({ status: false, message: err.message });
    }
  },

  getProductsAfiliateds: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user._id;

      const products = await userService.getAffiliatedProducts(userId);
      if (!products) {
        return res
          .status(400)
          .json({ status: false, message: "Erro ao pegar produtos" });
      }

      return res.status(200).json({
        status: true,
        data: products,
      });
    } catch (err: any) {
      return res.status(400).json({ status: false, message: err.message });
    }
  },
};

export default userController;
