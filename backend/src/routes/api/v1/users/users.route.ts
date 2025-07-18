import { Router } from 'express';
import * as usersController from '../../../../controllers/user/user.controller';

const router = Router();

router.get('/all', usersController.getAllUsers);
router.get('/:id', usersController.getUser);

router.post('/', usersController.insertUser);

export default router;
