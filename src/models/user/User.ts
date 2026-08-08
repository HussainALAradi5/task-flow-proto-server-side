import { Schema, model } from "mongoose";
import { baseSchemaFields } from "../BaseModel";
import { IUser } from "../../interface/user/User";
import { createMongooseEnum } from "../../utilities/enumUtils";
import { UserRole } from "../../enums/user/UserRoleEnum";

const userSchema = new Schema<IUser>(
  {
    ...baseSchemaFields,
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, default: "" },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", default: null },

    // Using the utility for the role field
    role: createMongooseEnum(UserRole, UserRole.MEMBER),

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
