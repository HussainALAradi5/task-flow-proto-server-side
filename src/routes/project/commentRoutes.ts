import { Router } from 'express';
import { CommentController } from '../../controllers/project/CommentController';
import { validateRequest } from '../../utilities/validateRequest';
import { createCommentSchema, updateCommentSchema } from '../../validations';

const router = Router({ mergeParams: true });

router.get('/task/:taskId', CommentController.getCommentsByTask);

router.post(
  '/',
  validateRequest(createCommentSchema),
  CommentController.createComment,
);

router.patch(
  '/:id',
  validateRequest(updateCommentSchema),
  CommentController.updateComment,
);

router.delete('/:id', CommentController.deleteComment);

export default router;
