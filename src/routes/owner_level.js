import { Router } from 'express';
import ownerLevelHandler from '../modules/owner_level/api_handlers.js';
import jwtAuth from '../helpers/jwt_auth.js';
import basicAuth from '../helpers/basic_auth.js';

const router = Router();


router.get('/:ownerLevelId', basicAuth, ownerLevelHandler.getOwnerLevel);
router.get('/name/:ownerLevelName', basicAuth, ownerLevelHandler.getOwnerLevelByName);
router.get('/brand/:brandId', basicAuth, ownerLevelHandler.getOwnerLevelByBrandId);
router.get('/', basicAuth, ownerLevelHandler.getOwnerLevels);

router.post('/', basicAuth, ownerLevelHandler.addOwnerLevel);

router.put('/:ownerLevelId', basicAuth, ownerLevelHandler.updateOwnerLevel);
router.put('/soft-delete/:ownerLevelId', basicAuth, ownerLevelHandler.softDeleteOwnerLevel);

router.delete('/:ownerLevelId', basicAuth, ownerLevelHandler.deleteOwnerLevel);

export default router;