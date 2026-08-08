import { Types } from "mongoose";

export interface IBaseEntity extends Document {
  code: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}