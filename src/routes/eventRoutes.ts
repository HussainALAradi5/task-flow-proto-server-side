import { BaseRoute } from './BaseRoute';
import { EventController } from '../controllers/EventController';
import { restrictTo } from '../middlewares/authMiddleware';
import { validateRequest } from '../utilities/validateRequest';
import { createEventSchema, updateEventSchema } from '../validations';

class EventRouteClass extends BaseRoute<typeof EventController> {
  constructor() {
    super(EventController);

    this.router.post(
      '/',
      restrictTo('Admin', 'Leader'),
      validateRequest(createEventSchema),
      EventController.create,
    );

    this.router.patch(
      '/:id',
      restrictTo('Admin'),
      validateRequest(updateEventSchema),
      EventController.update,
    );

    this.router.delete('/:id', restrictTo('Admin'), EventController.delete);
  }
}

export default new EventRouteClass().router;