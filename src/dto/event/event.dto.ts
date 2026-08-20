import { EntityType } from '../../enums/EntityType';

export interface CreateEventDto {
  title: string;
  description?: string;
  entityType: EntityType;
  entityId: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
}
