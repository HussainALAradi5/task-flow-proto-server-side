import { Schema } from "mongoose";

export const baseSchemaFields = {
  code: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, sparse: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
};
