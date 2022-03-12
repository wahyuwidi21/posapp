import joi from 'joi';

const addOwnerLevelSchema =  joi.object({
    brandId: joi.string().min(24).max(24).required(),
    ownerLevelName: joi.string().max(36).required()
});

const deleteOwnerLevelSchema = joi.object({
    ownerLevelId: joi.string().min(24).max(24).required()
});

const getOwnerLevelSchema = joi.string().min(24).max(24).required();

const getOwnerLevelByNameSchema = joi.string().max(36).required();

const updateOwnerLevelSchema = joi.object({
    brandId: joi.string().min(24).max(24),
    ownerLevelName: joi.string().max(36)
});

const softDeleteOwnerLevelSchema = joi.object({
    ownerLevelId: joi.string().min(24).max(24).required()
});

const schema = {
    addOwnerLevelSchema,
    deleteOwnerLevelSchema,
    getOwnerLevelSchema,
    getOwnerLevelByNameSchema,
    updateOwnerLevelSchema,
    softDeleteOwnerLevelSchema
};
export default schema;