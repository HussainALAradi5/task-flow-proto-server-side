import { BaseRoute } from './BaseRoute';
import { MediaController } from '../controllers/MediaController';

class MediaRouteClass extends BaseRoute<typeof MediaController> {
  constructor() {
    super(MediaController);

    this.router.get('/entity/:entityId', MediaController.getMediaByEntity);
  }
}

export default new MediaRouteClass().router;
