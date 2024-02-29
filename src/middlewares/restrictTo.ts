import { NextFunction, Request, Response } from "express";

export const restrictTo =
  (
    ...allowedRoles: string[] //recebe um array de string
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user; //pega o usuario

    if (!allowedRoles.includes(user.role)) {
      //verifica se a string da role do usuario ta presente no array de strings
      return res.status(403).json({
        status: false,
        message: "Você não tem permissão para acessar",
      });
    }

    next();
  };
