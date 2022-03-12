import joi from 'joi';

const checkUserSchema = joi.string().allow('').email().required();

const deleteUserSchema = joi.object({
    userId: joi.string().min(24).max(24).required(),
    roleId: joi.string().min(24).max(24).required()
});

const getUserSchema = joi.string().min(24).max(24).required();

const getUsersSchema = joi.object({
    search: joi.string().allow('').optional(),
    page: joi.number().optional(),
    limit: joi.number().optional(),
});

const getUsersByBrandIdSchema = joi.object({
    search: joi.string().allow('').optional(),
    page: joi.number().optional(),
    brandId: joi.string().min(24).max(24).required(),
    limit: joi.number().optional(),
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(16).required()
});

const registerSchema = joi.object({
    fullName: joi.string().max(50).min(3).regex(/^[A-Za-z '.]+$/).required(),
    phoneNumber: joi.string().min(9).max(14).regex(/^[0-9'.]+$/).required(),
    password: joi.string().min(6).max(16).required(),
    photo: joi.string().optional().allow(''),
    nik: joi.number().min(16).optional().allow(''),
    ktpPicture: joi.string().optional().allow(''),
    selfieWithKtp: joi.string().optional().allow(''),
    npwp: joi.string().optional().allow(''),
    npwpPicture: joi.string().optional().allow(''),
    email: joi.string().email().required().allow(''),
    address: joi.string().optional().allow(''),
    subDistrict: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    district: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    city: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    province: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    latitude: joi.number().optional().allow(''),
    longitude: joi.number().optional().allow(''),
    ownerLevelId: joi.string().min(24).max(24).required(),
    brandId: joi.string().min(24).max(24).required(), 
    roleId: joi.string().min(24).max(24).required()
});

const resetPasswdSchema = joi.string().email().required();

const setStatusSchema = joi.object({
    userId: joi.string().min(24).max(24).required(),
    status: joi.boolean().required(),
    roleId: joi.string().min(24).max(24).required(),
});

const updateResetPasswdSchema = joi.object({
    password: joi.string().min(6).max(16).required(),
    token: joi.string().required(),
    userId: joi.string().min(24).max(24).required()
});

const updateUserSchema = joi.object({
    userId: joi.string().min(24).max(24).required(),
    email: joi.string().email().required(),
    password: joi.string().allow('').min(6).max(16).optional(),
    oldPassword: joi.string().allow('').min(6).max(16).optional(),
    roleId: joi.string().min(24).max(24).optional(),
    fullName: joi.string().max(50).min(3).regex(/^[A-Za-z '.]+$/).required(),
    phoneNumber: joi.string().min(9).max(14).regex(/^[0-9'.]+$/).required(),
    photo: joi.string().optional().allow(''),
    nik: joi.number().min(16).optional().allow(''),
    ktpPicture: joi.string().optional().allow(''),
    selfieWithKtp: joi.string().optional().allow(''),
    npwp: joi.string().optional().allow(''),
    npwpPicture: joi.string().optional().allow(''),
    address: joi.string().optional().allow(''),
    subDistrict: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    district: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    city: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    province: joi.string().regex(/^[A-Za-z '.]+$/).optional().allow(''),
    latitude: joi.number().optional().allow(''),
    longitude: joi.number().optional().allow(''),
    ownerLevelId: joi.string().min(24).max(24).optional().allow(''),
    brandId: joi.string().min(24).max(24).optional().allow(''), 
});

const schema = {
    checkUserSchema,
    deleteUserSchema,
    getUserSchema,
    getUsersSchema,
    getUsersByBrandIdSchema,
    loginSchema,
    registerSchema,
    resetPasswdSchema,
    setStatusSchema,
    updateResetPasswdSchema,
    updateUserSchema
};
export default schema;