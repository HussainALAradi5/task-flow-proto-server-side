import { IMedia } from '../interface/Media';
import { Media } from '../models/Media';
import { BaseService } from './BaseService';
import { EntityModelType } from '../enums/EntityModelType';
import { toObjectId } from '../utilities/helpers';
import { QueryFilter } from 'mongoose';

class MediaServiceClass extends BaseService<IMedia> {
  constructor() {
    super(Media);
  }

  buildEntityFilter(entityType: EntityModelType, entityId: string): QueryFilter<IMedia> {
    return {
      entityType,
      entityId: toObjectId(entityId) as unknown as IMedia['entityId'],
    };
  }
}

export const MediaService = new MediaServiceClass();
