import {
  NextFunction,
  Request,
  Response,
} from 'express';

import userService from '../services/userService';
import { verifyJwt } from './jwt';

export const desserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accesToken;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accesToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.accessToken) {
      accesToken = req.cookies.accessToken;
    }

    if (!accesToken) {
      return res.status(401).json({
        status: false,
        message: "Você não está logado!",
      });
    }

    const decoded = verifyJwt<{ sub: string }>(accesToken);
    if (!decoded) {
      return res.status(401).json("Token inválido");
    }

    const user = await userService.findUserById(decoded.sub);

    if (!user) {
      return res.status(401).json("O usuário com esse token não existe");
    }

    res.locals.user = user;
    next()
  } catch (error: any) {
    next(error);
  }
};

export default desserializeUser;
