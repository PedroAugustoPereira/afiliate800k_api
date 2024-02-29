import config from "config";
import { omit } from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";

import { excludedFields } from "../controllers/authController";
import { signJwt } from "../middlewares/jwt";
import Products from "../models/productModel";
import Users, { UserDocument, UserType, userUpdate } from "../models/userModel";

const userService = {
  //verificação de email exist
  checkDataRegister: async (email: string) => {
    const emailCheck = await Users.findOne({ email });
    if (emailCheck) {
      return {
        status: false,
        message: "Usuário ou email já utilizado",
      };
    }

    return {
      status: true,
    };
  },

  //criando usuário
  createUser: async (
    email: string,
    password: string,
    role: null | string | undefined
  ) => {
    if (role !== "admin") {
      role = "user";
    }

    const user = await Users.create({
      email,
      password,
      role,
    });

    return omit(user.toJSON(), excludedFields);
  },

  //pegar usuário com base no id
  findUserById: async (id: string) => {
    const user = await Users.findById(id);

    if (user) {
      return omit(user, user!.password);
    }

    return false;
  },

  //pegar todos os usuários
  findAllUsers: async () => {
    return await Users.find();
  },

  //função para mecanismo de busca de usuários
  findUser: async (
    query: FilterQuery<UserType>,
    options: QueryOptions = {}
  ) => {
    return await Users.findOne(query, {}, options).select("+password");
  },

  //recebemos um topo userDocument
  signToken: async (user: UserDocument) => {
    //vamos com signjwt
    const access_token = signJwt(
      { sub: user._id }, // usamos como base do token o id do usuario, bem como
      {
        expiresIn: `${config.get<number>("accesTokenExpiresIn")}m`, //setamos o tempo de expiração do token em minutios
      }
    );

    //salvamos no redis (versões futuras)
    // redisClient.set(user._id.toString(), JSON.stringify(user), {
    //     EX: 60 * 60,
    // });

    return { access_token };
  },

  updatePerfil: async (
    name: string,
    imagePerfil: string | null,
    userId: string
  ) => {
    const user = await Users.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const perfilUser = await Users.findOneAndUpdate(
      { _id: user._id }, // especifique o _id do documento a ser atualizado
      { name, imagePerfil },
      { new: true } // retorne o documento atualizado
    );

    return perfilUser;
  },

  updateUser: async (data: userUpdate, userId: string) => {
    const user = await Users.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const perfilUser = await Users.findOneAndUpdate(
      { _id: user._id }, // especifique o _id do documento a ser atualizado
      data
    );

    return perfilUser;
  },

  getAffiliatedProducts: async (userId: string) => {
    // Buscar todos os RefAffiliates para o usuário atual
    const products = await Products.find({ affiliates: userId });
    if (!products) {
      throw new Error("erro ao pegar produtos");
    }

    if (products.length <= 0) {
      throw new Error("Ops, nada aqui ainda!");
    }

    return products;
  },

  updateSaldoFicticio: async (saldo: string, idUser: string, fake: string) => {
    const user = await Users.findById(idUser);
    if (!user) {
      throw new Error("Erro ao pegar produto");
    }

    if (fake == "fake1") {
      if (user.fake1) {
        throw new Error("Produto fake ja acionado");
      }

      user.fake1 = true;
    } else if (fake == "fake2") {
      if (user.fake2) {
        throw new Error("Produto fake ja acionado");
      }

      user.fake2 = true;
    } else {
      throw new Error("Fake não encontrado");
    }

    user.saldoFicticio += parseFloat(saldo);
    user.save();
    return user;
  },
};

export default userService;
