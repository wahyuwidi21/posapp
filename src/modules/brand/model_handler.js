import joi from 'joi';

const addBrandSchema =  joi.object({
    brandName: joi.string().max(36).required(),
    officeAddress: joi.string().max(100).required(),
    picName: joi.string().max(50).required(),
    picPhone: joi.string().min(9).max(14).required()
});

const deleteBrandSchema = joi.object({
    brandId: joi.string().min(24).max(24).required()
});

const getBrandSchema = joi.string().min(24).max(24).required();

const getBrandByNameSchema = joi.string().max(36).required();

const updateBrandSchema = joi.object({
    brandName: joi.string().max(36).required(),
    officeAddress: joi.string().max(100).required(),
    picName: joi.string().max(50).required(),
    picPhone: joi.string().min(9).max(14).required(),
    isActive: joi.bool().required()
});

const softDeleteBrandSchema = joi.object({
    brandId: joi.string().min(24).max(24).required()
});

const schema = {
    addBrandSchema,
    deleteBrandSchema,
    getBrandSchema,
    getBrandByNameSchema,
    updateBrandSchema,
    softDeleteBrandSchema
};
export default schema;