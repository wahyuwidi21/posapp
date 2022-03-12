import schema from './model_handler';
import utils from '../../helpers/utils';
import CommandRole from './command_domain';
import QueryRole from './query_domain';

const command = new CommandRole();
const query = new QueryRole();

const addRole = async (req, res) => {
    const body = req.body;
    const validateBody = utils.validateSchema(body, schema.addRoleSchema);
    if (validateBody.error) return utils.responseFail(res, validateBody.error);
    const response = await command.addRole(body);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 201, 'success', response.data);
};

const deleteRole = async (req, res) => {
    const param = {
        roleId: req.params.roleId
    };
    const validateParam = utils.validateSchema(param, schema.deleteRoleSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await command.deleteRole(param);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getRoles = async (req, res) => {
    const response = await query.getRoles();
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getRole = async (req, res) => {
    const roleId = req.params.roleId;
    const validateParam = utils.validateSchema(roleId, schema.getRoleSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getRoleById(roleId);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getRoleByName = async (req, res) => {
    const roleName = req.params.roleName;
    // const validateParam = utils.validateSchema(roleName, schema.getRoleByName);
    // if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getRoleByName(roleName);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const getRoleByBrandId = async (req, res) => {
    const brandId = req.params.brandId;
    const validateParam = utils.validateSchema(brandId, schema.getRoleSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getRoleByBrandId(brandId);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const updateRole = async (req, res) => {
    const body = req.body;
    const param = req.params.roleId
    const validateParam = utils.validateSchema(param, schema.getRoleSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const validateBody = utils.validateSchema(body, schema.updateRoleSchema);
    if (validateBody.error) return utils.responseFail(res, validateBody.error);
    const response = await command.updateRole(param,body);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

const softDeleteRole = async (req, res) => {
    const payload = {
        roleId: req.params.roleId,
    };
    const validatePayload = utils.validateSchema(payload, schema.softDeleteRoleSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.softDeleteRole(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'success', response.data);
};

export default {
    addRole,
    deleteRole,
    getRoles,
    getRole,
    getRoleByName,
    getRoleByBrandId,
    updateRole,
    softDeleteRole
};