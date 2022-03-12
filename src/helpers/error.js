const badRequest = (message = 'Bad Request') => {
    return {
        code: 400,
        message
    }
};
const unauthorized = (message = 'Unauthorized') => {
    return {
        code: 401,
        message
    }
};
const forbidden = (message = 'Forbidden') => {
    return {
        code: 403,
        message
    }
};
const notFound = (message = 'Not Found') => {
    return {
        code: 404,
        message
    }
};
const conflict = (message = 'Conflict') => {
    return {
        code: 409,
        message
    }
};
const internalServerError = (message = 'Internal Server Error') => {
    return {
        code: 500,
        message
    }
};
const serviceUnavailable = (message = 'Service Unavailable') => {
    return {
        code: 503,
        message
    }
};
const gatewayTimeout = (message = 'Gateway Timeout') => {
    return {
        code: 504,
        message
    }
};

const httpError = {
    badRequest,
    conflict,
    forbidden,
    gatewayTimeout,
    internalServerError,
    notFound,
    serviceUnavailable,
    unauthorized
};

export default httpError;