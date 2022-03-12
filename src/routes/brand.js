import { Router } from 'express';
import brandHandler from '../modules/brand/api_handlers';
import jwtAuth from '../helpers/jwt_auth';
import basicAuth from '../helpers/basic_auth';

const router = Router();


router.get('/:brandId', basicAuth, brandHandler.getBrand);
router.get('/name/:brandName', basicAuth, brandHandler.getBrandByName);
router.get('/', basicAuth, brandHandler.getBrands);

router.post('/', basicAuth, brandHandler.addBrand);

router.put('/:brandId', basicAuth, brandHandler.updateBrand);
router.put('/soft-delete/:brandId', basicAuth, brandHandler.softDeleteBrand);

router.delete('/:brandId', basicAuth, brandHandler.deleteBrand);

export default router;