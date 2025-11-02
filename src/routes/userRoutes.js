import { Router } from 'express';
import { autenticate } from '../middleware/autenticate.js';
import { upload } from '../middleware/multer.js';
import { updateUserData } from '../controllers/authController.js';

const router = Router()

router.patch("/users/me/avatar", autenticate, upload.single("avatar"), updateUserData)

export default router;