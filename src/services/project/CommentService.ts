import { IComment } from '../../interface/project/Comment';
import { Comment } from '../../models/project/Comment';
import { BaseService } from '../BaseService';
import { EventService } from '../EventService';
import { EntityType } from '../../enums/EntityType';
import { toObjectId } from '../../utilities/helpers';
import { QueryFilter } from 'mongoose';
import { PaginatedResult } from '../../interface/Pagination';
import { PaginationParams } from '../../utilities/pagination';

const COMMENT_POPULATE = {
  path: 'createdBy',
  select: 'userName email',
  model: 'User',
};

class CommentServiceClass extends BaseService<IComment> {
  constructor() {
    super(Comment);
  }

  override async getAllPaginated(
    filter: QueryFilter<IComment> = {},
    params: PaginationParams,
    search?: string,
    searchFields?: string[],
    exactMatch?: boolean,
    includeInactive?: boolean,
  ): Promise<PaginatedResult<IComment>> {
    const result = await super.getAllPaginated(filter, params, search, searchFields, exactMatch, includeInactive);
    const populated = await Comment.populate(result.data, COMMENT_POPULATE);
    return { ...result, data: populated };
  }

  async create(data: Partial<IComment>): Promise<IComment> {
    const comment = await super.create(data);
    await EventService.logEvent('Comment created', EntityType.TASK, comment.taskId.toString(), `New comment on task`, data.createdBy?.toString());
    return comment;
  }

  async update(id: string, data: Partial<IComment>): Promise<IComment | null> {
    const updated = await super.update(id, data);
    if (updated) {
      await EventService.logEvent('Comment updated', EntityType.TASK, updated.taskId.toString(), 'Comment was updated', id);
    }
    return updated;
  }

  async softDelete(id: string): Promise<IComment | null> {
    const deleted = await super.softDelete(id);
    if (deleted) {
      await EventService.logEvent('Comment deleted', EntityType.TASK, deleted.taskId.toString(), 'Comment was deleted', id);
    }
    return deleted;
  }

  buildTaskFilter(taskId: string): QueryFilter<IComment> {
    return { taskId: toObjectId(taskId) as unknown as IComment['taskId'] };
  }

  buildTaskUserFilter(taskId: string, userId: string): QueryFilter<IComment> {
    return {
      taskId: toObjectId(taskId) as unknown as IComment['taskId'],
      createdBy: toObjectId(userId) as unknown as IComment['createdBy'],
    };
  }
}

export const CommentService = new CommentServiceClass();
