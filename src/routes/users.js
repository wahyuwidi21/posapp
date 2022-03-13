import { Router } from 'express';
import userHandler from '../modules/users/api_handlers.js';
import basicAuth from '../helpers/basic_auth.js';
import jwtAuth from '../helpers/jwt_auth.js';

const router = Router();

router.delete('/:userId', jwtAuth, userHandler.deleteUser);

router.get('/check', basicAuth, userHandler.checkUser);
router.get('/:userId', basicAuth, userHandler.getUser);
router.get('/brand/:brandId', basicAuth, userHandler.getUsersByBrandId);
router.get('/', basicAuth, userHandler.getUsers);

router.post('/set-status', jwtAuth, userHandler.setStatus);
router.post('/login', basicAuth, userHandler.login);
router.post('/register', basicAuth, userHandler.register);
router.post('/reset-password', basicAuth, userHandler.updateResetPasswd);
router.post('/reset-password/request', basicAuth, userHandler.resetPassword);

router.put('/:userId', jwtAuth, userHandler.updateUser);

export default router;