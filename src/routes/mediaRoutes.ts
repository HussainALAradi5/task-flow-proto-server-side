import { BaseRoute } from './BaseRoute';
import { MediaController } from '../controllers/MediaController';

class MediaRouteClass extends BaseRoute<typeof MediaController> {
  constructor() {
    super(MediaController);

    this.router.get('/entity/:entityId', MediaController.getMediaByEntity);
    this.router.post('/', MediaController.create);
    this.router.patch('/:id', MediaController.update);
    this.router.delete('/:id', MediaController.delete);
  }
}

export default new MediaRouteClass().router;
