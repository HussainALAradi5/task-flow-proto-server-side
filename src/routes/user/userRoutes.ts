import { Router } from 'express';
import { UserController } from '../../controllers/user/UserController';
import { restrictTo } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../utilities/validateRequest';
import { updateUserSchema, updateRoleSchema } from '../../validations';

const profileRouter = Router();
const userCRUDRouter = Router();

// Profile routes (any authenticated user)
profileRouter.get('/profile', UserController.getProfile);
profileRouter.patch('/profile', validateRequest(updateUserSchema), UserController.updateProfile);

// Admin-only user management
userCRUDRouter.get('/', restrictTo('Admin'), UserController.getAll);
userCRUDRouter.get('/:id', restrictTo('Admin'), UserController.getById);
userCRUDRouter.patch('/:id', restrictTo('Admin'), validateRequest(updateUserSchema), UserController.update);
userCRUDRouter.delete('/:id', restrictTo('Admin'), UserController.delete);
userCRUDRouter.patch('/:id/role', restrictTo('Admin'), validateRequest(updateRoleSchema), UserController.updateRole);

export { profileRouter as profile, userCRUDRouter as userCRUD };
