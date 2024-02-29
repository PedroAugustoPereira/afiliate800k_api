import { NextFunction, Request, Response } from "express";

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      console.log("teste aqui");
      return res.status(401).json("Sua sessão expirou!");
    }

    console.log(user);

    next();
  } catch (err: any) {
    next(err);
  }
};
