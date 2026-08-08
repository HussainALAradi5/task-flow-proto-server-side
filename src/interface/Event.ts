import { Schema } from "mongoose";
import { IBaseEntity } from "./BaseModel";
import { EntityType } from "../enums/EntityTypeEnum";

export interface IEvent extends IBaseEntity {
  title: string;
  description?: string;
  entityType: EntityType;
  entityId: Schema.Types.ObjectId;
}