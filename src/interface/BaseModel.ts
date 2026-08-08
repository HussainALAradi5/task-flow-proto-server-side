
import { Types } from "mongoose";
import * as mongoose from "mongoose";

export interface IBaseEntity extends mongoose.Document {
  code: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}