import mongoose from "mongoose";

// Defina o esquema para RefAffiliate
export interface RefAffiliateDocument extends mongoose.Document {
  ref: string;
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
}

export const refAffiliateSchema = new mongoose.Schema<RefAffiliateDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    ref: {
      type: String,
      required: true,
      unique: true, // Garante que o campo 'ref' seja único
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products", // Referência ao modelo de produtos
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RefAffiliate = mongoose.model<RefAffiliateDocument>(
  "RefAffiliates",
  refAffiliateSchema
);

export default RefAffiliate;
