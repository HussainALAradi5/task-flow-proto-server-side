import { model, Schema } from "mongoose";
import { IEvent } from "../interface/Event";
import { baseSchemaFields } from "./BaseModel";
import { EntityType } from '../enums/EntityType';
import { createMongooseEnum } from "../utilities/enumUtils";

const eventSchema = new Schema<IEvent>(
  {
    ...baseSchemaFields,
    title: { type: String, required: true },
    description: { type: String, default: "" },
    entityType: createMongooseEnum(EntityType),
    entityId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

eventSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const Event = model<IEvent>("Event", eventSchema);
