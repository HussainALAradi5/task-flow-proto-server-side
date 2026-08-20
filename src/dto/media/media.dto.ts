import { EntityModelType } from '../../enums/EntityModelType';

export interface CreateMediaDto {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  entityType: EntityModelType;
  entityId: string;
}
