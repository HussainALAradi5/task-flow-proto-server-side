import { model, Schema } from 'mongoose';
import { IComment } from '../../interface/project/Comment';
import { baseSchemaFields } from '../BaseModel';

const commentSchema = new Schema<IComment>(
  {
    ...baseSchemaFields,
    content: { type: String, required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Comment = model<IComment>('Comment', commentSchema);
