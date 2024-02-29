import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { productSchema } from "./productModel";
import { refAffiliateSchema } from "./refAfiliateModel";
import { SaleSchema } from "./saleModel";

export interface userUpdate {
  email?: string;
  name?: string;
  imagePerfil?: string;
  firstTime?: boolean;
  saldo?: number;
  saldoFicticio?: number;
  fake1?: boolean;
  fake2?: boolean;
}

//tipo de documento de usuário (estritiamente necessário)
export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  products?: mongoose.Schema.Types.ObjectId[];
  role?: string;
  name?: string;
  imagePerfil?: string;
  firstTime?: boolean;
  refAfiliate?: mongoose.Schema.Types.ObjectId[];
  sales?: mongoose.Schema.Types.ObjectId[];
  saldo: number;
  saldoFicticio: number;
  fake1: boolean;
  fake2: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

//schema de usuário
export const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },

    role: {
      type: String,
      default: "user",
    },

    firstTime: {
      type: Boolean,
      default: true,
    },

    name: {
      type: String,
    },

    imagePerfil: {
      typse: String,
    },

    products: [
      {
        types: mongoose.Schema.Types.ObjectId,
        ref: productSchema,
      },
    ],

    refAfiliate: [
      {
        types: mongoose.Schema.Types.ObjectId,
        ref: refAffiliateSchema,
      },
    ],

    sales: [
      {
        types: mongoose.Schema.Types.ObjectId,
        ref: SaleSchema,
      },
    ],

    saldo: {
      type: Number,
      default: 0.0,
    },

    saldoFicticio: {
      type: Number,
      default: 0.0,
    },

    fake1: {
      type: Boolean,
    },

    fake2: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

//emcriptar senha
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//comparar senha
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1 });

const Users = mongoose.model<UserDocument>("Users", userSchema);

//tipo da schema
export type UserType = typeof userSchema;

export default Users;
