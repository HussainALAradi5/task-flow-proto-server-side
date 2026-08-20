import { model, Schema } from 'mongoose';
import { IMedia } from '../interface/Media';
import { baseSchemaFields } from './BaseModel';
import { EntityModelType } from '../enums/EntityModelType';

const mediaSchema = new Schema<IMedia>(
  {
    ...baseSchemaFields,
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    entityType: {
      type: String,
      enum: Object.values(EntityModelType),
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

export const Media = model<IMedia>('Media', mediaSchema);
