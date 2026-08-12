import { Event } from '../models/Event';
import { IEvent } from '../interface/Event';
import { BaseService } from './BaseService';
import { EntityType } from '../enums/EntityType';
import { toObjectId } from '../utilities/helpers';

class EventServiceClass extends BaseService<IEvent> {
  constructor() {
    super(Event);
  }

  async logEvent(
    title: string,
    entityType: EntityType,
    entityId: string,
    description: string = '',
    userId?: string,
  ): Promise<IEvent> {
    const eventData: Partial<IEvent> = {
      title,
      entityType,
      entityId: toObjectId(entityId) as unknown as IEvent['entityId'],
      description,
      ...(userId ? { createdBy: toObjectId(userId) as unknown as IEvent['createdBy'] } : {}),
    };

    return await this.create(eventData);
  }
}

export const EventService = new EventServiceClass();