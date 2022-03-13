import { Router } from 'express';
import roleHandler from '../modules/roles/api_handlers.js';
import jwtAuth from '../helpers/jwt_auth.js';
import basicAuth from '../helpers/basic_auth.js';

const router = Router();


router.get('/:roleId', basicAuth, roleHandler.getRole);
router.get('/name/:roleName', basicAuth, roleHandler.getRoleByName);
router.get('/brand/:brandId', basicAuth, roleHandler.getRoleByBrandId);
router.get('/', basicAuth, roleHandler.getRoles);

router.post('/', basicAuth, roleHandler.addRole);

router.put('/:roleId', basicAuth, roleHandler.updateRole);
router.put('/soft-delete/:roleId', basicAuth, roleHandler.softDeleteRole);

router.delete('/:roleId', basicAuth, roleHandler.deleteRole);

export default router;