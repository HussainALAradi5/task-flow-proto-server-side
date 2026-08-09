import { BaseRoute } from './BaseRoute';
import { EventController } from '../controllers/EventController';

class EventRouteClass extends BaseRoute<typeof EventController> {
  constructor() {
    super(EventController);
  }
}

export default new EventRouteClass().router;