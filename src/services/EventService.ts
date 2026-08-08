import { Event } from '../models/Event';
import { IEvent } from '../interface/Event';
import { BaseService } from './BaseService';
import { EntityType } from '../enums/EntityTypeEnum';
import { Types } from 'mongoose';

class EventServiceClass extends BaseService<IEvent> {
  constructor() {
    super(Event);
  }

  // Uses strict EntityType enum and type-safe ObjectId casting with zero 'any'
  async logEvent(
    title: string, 
    entityType: EntityType, 
    entityId: string, 
    description: string = '', 
    userId?: string
  ): Promise<IEvent> {
    const eventData: Partial<IEvent> = {
      title,
      entityType,
      entityId: new Types.ObjectId(entityId) as unknown as IEvent['entityId'],
      description,
      ...(userId ? { createdBy: new Types.ObjectId(userId) as unknown as IEvent['createdBy'] } : {}),
    };

    return await this.create(eventData);
  }
}
export const EventService = new EventServiceClass();