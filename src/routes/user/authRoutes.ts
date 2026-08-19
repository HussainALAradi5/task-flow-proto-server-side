import { Router } from 'express';
import { UserController } from '../../controllers/user/UserController';
import { validateRequest } from '../../utilities/validateRequest';
import { signupSchema, loginSchema } from '../../validations';

const router = Router();

router.post('/signup', validateRequest(signupSchema), UserController.signup);
router.post('/login', validateRequest(loginSchema), UserController.login);

export { router as signup, router as login };
