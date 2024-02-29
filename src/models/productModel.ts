import mongoose, { ObjectId } from 'mongoose';

export interface ProductDocument extends mongoose.Document {
  _id: ObjectId;
  name: string;
  price: number;
  comission: number;
  checkout: string;
  description: string;
  imageMain: string;
  imageEmpire: string;
  createdByUser: mongoose.Schema.Types.ObjectId;
  sales?: mongoose.Types.ObjectId[];
  affiliates?: mongoose.Types.ObjectId[];
  revenue?: number;
}

export const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    comission: {
      type: Number,
      required: true,
    },

    checkout: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    imageMain: {
      type: String,
    },

    imageEmpire: {
      type: String,
    },

    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    affiliates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    sales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sales",
      },
    ],

    revenue: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model<ProductDocument>("Products", productSchema);

//tipo da schema
export type ProductType = typeof productSchema;

export default Products;
