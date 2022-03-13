import Role from '../../models/roles.js';
import utils from '../../helpers/utils.js';
import err from '../../helpers/error.js';

class Roles {

  async deleteOneRole(params) {
    try {
      const result = await Role.deleteOne(params);
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('delete role failed'));
    }
  }
  async findManyRole(params) {
    try {
      const result = await Role.find({}).populate("brand");
      if (result) return utils.wrapperData(result);
      else return utils.wrapperError(err.notFound('role not found'));
    } catch (error) {
      return utils.wrapperError(err.notFound('role not found'));
    }
  }
  async findOneRole(params) {
    try {
      const result = await Role.find(params).populate("brand");
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.notFound('data not found'));
    }
  }
  async insertOneRole(data) {
    try {
      const argument = new Role(data);
      const result = await argument.save();
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('insert role failed'));
    }
  }
  async updateOneRole(data, params) {
    try {
      const result = await Role.updateOne(params,data)
      // const result = await db.Role.update(data, params);
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('update role failed'));
    }
  }
}

export default Roles;