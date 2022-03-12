import joi from 'joi';

const addRoleSchema =  joi.object({
    brandId: joi.string().min(24).max(24).required(),
    roleName: joi.string().max(36).required()
});

const deleteRoleSchema = joi.object({
    roleId: joi.string().min(24).max(24).required()
});

const getRoleSchema = joi.string().min(24).max(24).required();

const getRoleByNameSchema = joi.string().max(36).required();

const updateRoleSchema = joi.object({
    brandId: joi.string().min(24).max(24),
    roleName: joi.string().max(36)
});

const softDeleteRoleSchema = joi.object({
    roleId: joi.string().min(24).max(24).required()
});

const schema = {
    addRoleSchema,
    deleteRoleSchema,
    getRoleSchema,
    getRoleByNameSchema,
    updateRoleSchema,
    softDeleteRoleSchema
};
export default schema;