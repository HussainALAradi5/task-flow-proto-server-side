import { Schema } from 'mongoose';
import { IBaseEntity } from './BaseModel';
import { EntityModelType } from '../enums/EntityModelType';

export interface IMedia extends IBaseEntity {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  entityType: EntityModelType;
  entityId: Schema.Types.ObjectId;
}
