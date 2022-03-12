import schema from './model_handler';
import utils from '../../helpers/utils';
import CommandBrand from './command_domain';
import QueryBrand from './query_domain';

const command = new CommandBrand();
const query = new QueryBrand();

const addBrand = async (req, res) => {
    const body = req.body;
    const validateBody = utils.validateSchema(body, schema.addBrandSchema);
    if (validateBody.error) return utils.responseFail(res, validateBody.error);
    const response = await command.addBrand(body);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 201, 'success', response.data);
};

const deleteBrand = async (req, res) => {
    const param = {
        brandId: req.params.brandId
    };
    const validateParam = utils.validateSchema(param, schema.deleteBrandSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await command.deleteBrand(param);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getBrands = async (req, res) => {
    const response = await query.getBrands();
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getBrand = async (req, res) => {
    const brandId = req.params.brandId;
    const validateParam = utils.validateSchema(brandId, schema.getBrandSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getBrandById(brandId);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getBrandByName = async (req, res) => {
    const brandName = req.params.brandName;
    // const validateParam = utils.validateSchema(brandName, schema.getBrandByName);
    // if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getBrandByName(brandName);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};


const updateBrand = async (req, res) => {
    const body = req.body;
    const params = req.params.brandId;
    const validateParam = utils.validateSchema(params, schema.getBrandSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const validateBody = utils.validateSchema(body, schema.updateBrandSchema);
    if (validateBody.error) return utils.responseFail(res, validateBody.error);
    const response = await command.updateBrand(params,body);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const softDeleteBrand = async (req, res) => {
    const payload = {
        brandId: req.params.brandId,
    };
    const validatePayload = utils.validateSchema(payload, schema.softDeleteBrandSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.softDeleteBrand(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

export default {
    addBrand,
    deleteBrand,
    getBrands,
    getBrand,
    getBrandByName,
    updateBrand,
    softDeleteBrand
};