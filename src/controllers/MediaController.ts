import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { IMedia } from '../interface/Media';
import { MediaService } from '../services/MediaService';
import { catchAsync } from '../utilities/catchAsync';
import { getPaginationParams } from '../utilities/pagination';
import { parseParamId } from '../utilities/helpers';
import { EntityModelType } from '../enums/EntityModelType';

class MediaControllerClass extends BaseController<IMedia> {
  constructor() {
    super(MediaService);
  }

  getMediaByEntity = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const entityType = req.query.entityType as EntityModelType;
    const entityId = parseParamId(req, 'entityId');
    const filter = MediaService.buildEntityFilter(entityType, entityId);
    const pagination = getPaginationParams(req);
    const result = await MediaService.getAllPaginated(filter, pagination);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const MediaController = new MediaControllerClass();
