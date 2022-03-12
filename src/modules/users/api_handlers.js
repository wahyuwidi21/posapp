import schema from './model_handler';
import utils from '../../helpers/utils';
import CommandUser from './command_domain';
import QueryUser from './query_domain';
import formidable from 'formidable';

const command = new CommandUser();
const query = new QueryUser();

const checkUser = async (req, res) => {
    const param = req.query.email || '';console.log(param)
    const validateParam = utils.validateSchema(param, schema.checkUserSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.checkUserByEmail(param);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'check user success', response.data);
};

const deleteUser = async (req, res) => {
    const param = { 
        roleId: req.roleId,
        userId: req.params.userId
    };
    const validateParam = utils.validateSchema(param, schema.deleteUserSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await command.deleteUser(param);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'delete user success', response.data);
};

const getUser = async (req, res) => {
    const param = req.params.userId || req.userId;
    console.log(param);
    const validateParam = utils.validateSchema(param, schema.getUserSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getUserById(param);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'get user success', response.data);
};

const getUsersByBrandId = async (req, res) => {
    const { search, page, limit } = req.query;
    const brandId = req.params.brandId;
    const payload = {
        search,
        brandId,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    }
    const validateParam = utils.validateSchema(payload, schema.getUsersByBrandIdSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getUsersByBrandId(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccessPagination(res, 200, 'get user success', response);
};

const getUsers = async (req, res) => {
    const { search, page, limit } = req.query;
    const payload = {
        search,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    }
    const validateParam = utils.validateSchema(payload, schema.getUsersSchema);
    if (validateParam.error) return utils.responseFail(res, validateParam.error);
    const response = await query.getUsers(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccessPagination(res, 200, 'get user success', response);
};

const login = async (req, res) => {
    const payload = req.body;
    const validatePayload = utils.validateSchema(payload, schema.loginSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.login(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'login success', response.data);
};

const register = async (req, res) => {
    const payload = req.body;
    const validatePayload = utils.validateSchema(payload, schema.registerSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.register(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 201, 'register success', response.data);
};

const resetPassword = async (req, res) => {
    const email = req.body.email;
    const validatePayload = utils.validateSchema(email, schema.resetPasswdSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.resetPasswd(email);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'request reset password success', response.data);
};

const setStatus = async (req, res) => {
    const payload = req.body;
    payload.roleId = req.roleId;
    const validatePayload = utils.validateSchema(payload, schema.setStatusSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.setStatus(payload);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'set status success', response.data);
};

const updateResetPasswd = async (req, res) => {
    const body = req.body;
    const validatePayload = utils.validateSchema(body, schema.updateResetPasswdSchema);
    if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
    const response = await command.updateResetPasswd(body);
    return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'reset password success', response.data);
};

const updateUser = async (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const payload = {
            ...fields,
            userId: req.params.userId || req.userId,
            photo: files.photo
        };
        const validatePayload = utils.validateSchema(payload, schema.updateUserSchema);
        if (validatePayload.error) return utils.responseFail(res, validatePayload.error);
        const response = await command.updateUser(payload);
        return (response.error) ? utils.responseFail(res, response.error) : utils.responseSuccess(res, 200, 'update user success', response.data);
    });   
};

export default {
    checkUser,
    deleteUser,
    getUser,
    getUsers,
    getUsersByBrandId,
    login,
    register,
    resetPassword,
    setStatus,
    updateResetPasswd,
    updateUser
};