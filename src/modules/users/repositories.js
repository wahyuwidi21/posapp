
import utils from '../../helpers/utils.js';
import err from '../../helpers/error.js';
import User from '../../models/users.js'

class Users {
  async deleteOneUser(params) {
    try {
      const result = await db.User.destroy(params);
      return utils.wrapperData(result);
    } catch (error) {
      return utils.wrapperError(err.internalServerError('delete data failed'));
    }
  }
  async findAndCountAllUser(params) {
    try {
      const rows = await User.find(params,{password: 0});
      const count = rows.length;
      if (count >= 1) return utils.wrapperData({count, rows});
      return utils.wrapperError(err.notFound('user not found'));
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.notFound('user not found'));
    }
  }
  async findManyUser(params) {
    try {
      const result = await User.find(params);
      if (result) return utils.wrapperData(result);
      else return utils.wrapperError(err.notFound('user not found'));
    } catch (error) {
      return utils.wrapperError(err.notFound('user not found'));
    }
  }
  async findOneUser(params) {
    try {
      const result = await User.find(params);
      if (result.length>0) return utils.wrapperData(result);
      else return utils.wrapperError(err.notFound('user not found'));
    } catch (error) {
      return utils.wrapperError(err.notFound('user not found'));
    }
  }
  async insertOneUser(data) {
    try {
      const argument = new User(data);
      const result = argument.save();
      return utils.wrapperData(result);
    } catch (error) {
      return utils.wrapperError(err.internalServerError('insert data failed'));
    }
  }
  async updateOneUser(data, params) {
    try {
      const result = await db.User.update(data, params);
      return utils.wrapperData(result);
    } catch (error) {
      return utils.wrapperError(err.internalServerError('update data failed'));
    }
  }
}

export default Users;