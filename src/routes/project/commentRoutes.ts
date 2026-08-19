import { Router } from 'express';
import { CommentController } from '../../controllers/project/CommentController';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { createCommentSchema, updateCommentSchema } from '../../validations';

const router = Router({ mergeParams: true });

router.get('/task/:taskId', CommentController.getCommentsByTask);

router.post(
  '/',
  restrictTo('Admin', 'Leader'),
  validateRequest(createCommentSchema),
  CommentController.createComment,
);

router.patch(
  '/:id',
  restrictTo('Admin', 'Leader', 'Member'),
  validateRequest(updateCommentSchema),
  CommentController.updateComment,
);

router.delete('/:id', restrictTo('Admin', 'Leader', 'Member'), CommentController.deleteComment);

export default router;
