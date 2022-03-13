import err from './error.js';

const responseFail = (res, error) => {
    const {message, code} = error;
    const response = {
        message,
        status: false,
        statusCode: code
    };
    return res.status(code).json(response);
}

const responseSuccess = (res, statusCode, message, data) => {
    const response = {
        data,
        message,
        status: true,
        statusCode
    };
    return res.status(statusCode).json(response);
}

const responseSuccessPagination = (res, statusCode, message, result) => {
    const response = {
        data: result.data,
        meta: result.meta,
        message,
        status: true,
        statusCode
    };
    return res.status(statusCode).json(response);
}

const validateSchema = (payload, schema) => {
    const {value: data, error: message} = schema.validate(payload);
    if (message) {
        return wrapperError(err.badRequest(message.details[0].message));
    }
    return wrapperData(data);
}

const wrapperData = (data) => {
    return {
        data,
        error: null
    };
}

const wrapperDataPagination = (data, meta) => {
    return {
        data,
        error: null,
        meta
    };
}

const wrapperError = (error) => {
    return {
        data: null,
        error
    };
}

const utils = {
    responseFail,
    responseSuccess,
    responseSuccessPagination,
    validateSchema,
    wrapperData,
    wrapperDataPagination,
    wrapperError
};

export default utils;