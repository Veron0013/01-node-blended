import { celebrate } from 'celebrate';
import { Router } from 'express';
import { registerUserSchema } from '../validation/authValidation.js';
import { registerUser } from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);

export default router;
