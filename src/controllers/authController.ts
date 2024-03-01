import { CookieOptions, NextFunction, Request, Response } from "express";

import { CreateUserInput, LoginUserInput } from "../schema/user.schema";
import userService from "../services/userService";

//exçuindo senhas em retornos de autenticação
export const excludedFields = ["password"];

//configuração de opções de token
const accesTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + /*config.get<number>("accessTokenExpiresIn")*/ 30 * 60 * 1000
  ),
  maxAge: /*config.get<number>("accessTokenExpiresIn")*/ 30 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

//configuração do token para ambiente de produção
if (process.env.state !== "dev") {
  accesTokenCookieOptions.secure = true;
  accesTokenCookieOptions.sameSite = "none"; // Adicione esta linha
}

//controller de Autênticação
const authController = {
  //registro de usuários
  register: async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("teste aquui"); //dfg

    const { email, password, role } = req.body;

    try {
      //verificação se o o email ja está cadastrado
      const emailCheck = await userService.checkDataRegister(email);

      if (!emailCheck.status) {
        return res.status(200).json({
          status: false,
          message: emailCheck.message,
        });
      }

      //chama o service para se comunicar com o banco.
      const user = await userService.createUser(email, password, role);

      //retorna o novo usuário criado
      if (user) {
        return res.json({ status: true, data: { user } });
      }

      return res.status(400).json({ status: false });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ status: false, message: error.message });
      }

      //next em error
      next(error);
    }
  },

  //login de usuários
  login: async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    //imediatamente vimos que temos o tipo LoginUserInput participando de req ára validar os dados

    try {
      //verificamos se um usuario com esse nome existe
      const user = await userService.findUser({ email: req.body.email });
      //se não existe ou as senhas não batem, mandamos um dos nossos erros com AppError
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({
          status: false,
          message: "Email ou senha inválidos",
        });
      }
      console.log(user);
      //se existe vamos usar o servico de usuario para criar um token
      const { access_token } = await userService.signToken(user);

      //crria o token na resposta, e seta as opções
      res.cookie("accessToken", access_token, accesTokenCookieOptions);
      res.cookie("logged_in", true, {
        //cria token que definie que o usuario está logado
        ...accesTokenCookieOptions,
        httpOnly: false,
      });

      //devolve o teoken e com status de successo
      res.status(200).json({
        status: true,
        firstTime: user.firstTime,
        access_token,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
