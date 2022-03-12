import auth from 'basic-auth';
import err from './error';
import utils from './utils';

const checkBasic = async (req, res, next) => {
    const user = auth(req);
    if (user?.name === process.env.USERNAME_BASIC && user?.pass === process.env.PASSWORD_BASIC) next();
    else return utils.responseFail(res, err.unauthorized());
}

export default checkBasic