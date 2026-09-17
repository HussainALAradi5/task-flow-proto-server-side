import { Schema } from 'mongoose';
import { IBaseEntity } from '../BaseModel';

export interface IComment extends IBaseEntity {
  content: string;
  taskId: Schema.Types.ObjectId;
  isActive: boolean;
}
