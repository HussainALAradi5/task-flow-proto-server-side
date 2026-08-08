import { IBaseEntity } from "../BaseModel";

export interface ITeam extends IBaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}
