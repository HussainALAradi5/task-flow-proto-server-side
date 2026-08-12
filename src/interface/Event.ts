import { Schema } from "mongoose";
import { IBaseEntity } from "./BaseModel";
import { EntityType } from '../enums/EntityType';

export interface IEvent extends IBaseEntity {
  title: string;
  description?: string;
  entityType: EntityType;
  entityId: Schema.Types.ObjectId;
}