import { IMedia } from '../interface/Media';
import { Media } from '../models/Media';
import { BaseService } from './BaseService';
import { EventService } from './EventService';
import { EntityModelType } from '../enums/EntityModelType';
import { EntityType } from '../enums/EntityType';
import { toObjectId } from '../utilities/helpers';
import { QueryFilter } from 'mongoose';

class MediaServiceClass extends BaseService<IMedia> {
  constructor() {
    super(Media);
  }

  async create(data: Partial<IMedia>): Promise<IMedia> {
    const media = await super.create(data);
    await EventService.logEvent(
      'File uploaded',
      EntityType.TASK,
      media.id,
      `File: ${media.originalName}`,
      data.createdBy?.toString(),
    );
    return media;
  }

  buildEntityFilter(entityType: EntityModelType, entityId: string): QueryFilter<IMedia> {
    return {
      entityType,
      entityId: toObjectId(entityId) as unknown as IMedia['entityId'],
    };
  }
}

export const MediaService = new MediaServiceClass();
