import mongoose, { Document, ObjectId } from "mongoose";

export interface ProductDocument extends Document {
  _id: ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  imageFeatured: string;
}

export const featuredProductsSchema = new mongoose.Schema<ProductDocument>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },

    imageFeatured: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const featuredProducts = mongoose.model<ProductDocument>(
  "FeaturedProducts",
  featuredProductsSchema
);

//tipo da schema
export type featuredProductsType = typeof featuredProductsSchema;

export default featuredProducts;
