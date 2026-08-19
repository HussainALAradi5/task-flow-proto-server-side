import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IComment } from '../../interface/project/Comment';
import { CommentService } from '../../services/project/CommentService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { parseParamId } from '../../utilities/helpers';
import { UserRole } from '../../enums/user/UserRole';

class CommentControllerClass extends BaseController<IComment> {
  constructor() {
    super(CommentService);
  }

  createComment = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const comment = await CommentService.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: comment });
  });

  getCommentsByTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const taskId = parseParamId(req, 'taskId');
    const filter = CommentService.buildTaskFilter(taskId);
    const pagination = getPaginationParams(req);
    const result = await CommentService.getAllPaginated(filter, pagination);
    res.status(200).json({ status: 'success', ...result });
  });

  updateComment = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const comment = await CommentService.getById(id);

    if (!comment) {
      res.status(404).json({ status: 'error', message: 'Comment not found' });
      return;
    }

    const isCreator = comment.createdBy?.toString() === req.user!.id;
    const isAdminOrLeader = req.user!.role === UserRole.ADMIN || req.user!.role === UserRole.LEADER;

    if (!isCreator && !isAdminOrLeader) {
      res.status(403).json({ status: 'error', message: 'You can only edit your own comments' });
      return;
    }

    const updated = await CommentService.update(id, req.body);
    res.status(200).json({ status: 'success', data: updated });
  });

  deleteComment = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const comment = await CommentService.getById(id);

    if (!comment) {
      res.status(404).json({ status: 'error', message: 'Comment not found' });
      return;
    }

    const isCreator = comment.createdBy?.toString() === req.user!.id;
    const isAdminOrLeader = req.user!.role === UserRole.ADMIN || req.user!.role === UserRole.LEADER;

    if (!isCreator && !isAdminOrLeader) {
      res.status(403).json({ status: 'error', message: 'You can only delete your own comments' });
      return;
    }

    await CommentService.softDelete(id);
    res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
  });
}

export const CommentController = new CommentControllerClass();
