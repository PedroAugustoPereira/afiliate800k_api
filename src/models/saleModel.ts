import mongoose from "mongoose";

// Defina o esquema para RefAffiliate
export interface SaleDocument extends mongoose.Document {
  refAfiliate: mongoose.Schema.Types.ObjectId;
}

export const SaleSchema = new mongoose.Schema<SaleDocument>(
  {
    refAfiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RefAffiliates",
    },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model<SaleDocument>("Sales", SaleSchema);

export default Sales;
