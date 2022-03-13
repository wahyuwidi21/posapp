import jwt from 'jsonwebtoken';
import err from './error.js';
import utils from './utils.js';
import User from '../modules/users/repositories.js';
const user = new User();

const jwtVerify = async (req, res, next) => {
    const headers = req.headers;
    if (headers && headers.authorization && headers.authorization.includes('Bearer')) {
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            let decode;
            try {
                decode = await jwt.verify(parted[1], process.env.SECRET_KEY);
            } catch (error) {
                return utils.responseFail(res, err.forbidden('Invalid token!'));
            }
            const userData = await user.findOneUser({
                where: {
                    user_id: decode.userId
                }
            });
            if (userData.data) {
                req.userId = decode.userId;
                req.roleId = decode.roleId;
                return next();
            }
        }
    }
    return utils.responseFail(res, err.forbidden('Invalid token!'));
}

export default jwtVerify