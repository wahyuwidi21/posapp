import schema from './model_handler';
import utils from '../../helpers/utils';
import CommandOwnerLevel from './command_domain';
import QueryOwnerLevel from './query_domain';

const command = new CommandOwnerLevel();
const query = new QueryOwnerLevel();

const addOwnerLevel = async (req, res) => {
    const body = req.body;
    const validateBody = utils.validateSchema(body, schema.addOwnerLevelSchema);
    if (validateBody.error) return utils.responseFail(res, validateBody.error);
    const response = await command.addOwnerLevel(body);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 201, 'success', response.data);
};

const deleteOwnerLevel = async (req, res) => {
    const param = {
        ownerLevelId: req.params.ownerLevelId
    };
    const validateParam = utils.validateSchema(param, schema.deleteOwnerLevelSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await command.deleteOwnerLevel(param);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getOwnerLevels = async (req, res) => {
    const response = await query.getOwnerLevels();
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getOwnerLevel = async (req, res) => {
    const ownerLevelId = req.params.ownerLevelId;
    const validateParam = utils.validateSchema(ownerLevelId, schema.getOwnerLevelSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getOwnerLevelById(ownerLevelId);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getOwnerLevelByName = async (req, res) => {
    const ownerLevelName = req.params.ownerLevelName;
    // const validateParam = utils.validateSchema(ownerLevelName, schema.getOwnerLevelByName);
    // if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getOwnerLevelByName(ownerLevelName);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getOwnerLevelByBrandId = async (req, res) => {
    const brandId = req.params.brandId;
    const validateParam = utils.validateSchema(brandId, schema.getOwnerLevelSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getOwnerLevelByBrandId(brandId);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const updateOwnerLevel = async (req, res) => {
    const body = req.body;
    const param = req.params.ownerLevelId
    const validateParam = utils.validateSchema(param, schema.getOwnerLevelSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const validateBody = utils.validateSchema(body, schema.updateOwnerLevelSchema);
    if (validateBody.error) return utils.responseFail(res, validateBody.error);
    const response = await command.updateOwnerLevel(param,body);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const softDeleteOwnerLevel = async (req, res) => {
    const payload = {
        ownerLevelId: req.params.ownerLevelId,
    };
    const validatePayload = utils.validateSchema(payload, schema.softDeleteOwnerLevelSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.softDeleteOwnerLevel(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

export default {
    addOwnerLevel,
    deleteOwnerLevel,
    getOwnerLevels,
    getOwnerLevel,
    getOwnerLevelByName,
    getOwnerLevelByBrandId,
    updateOwnerLevel,
    softDeleteOwnerLevel
};