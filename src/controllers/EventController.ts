import { BaseController } from './BaseController';
import { EventService } from '../services/EventService';
import { IEvent } from '../interface/Event';

class EventControllerClass extends BaseController<IEvent> {
  constructor() {
    super(EventService);
  }
}

export const EventController = new EventControllerClass();