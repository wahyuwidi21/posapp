import OwnerLevel from '../../models/owner_level';
import utils from '../../helpers/utils';
import err from '../../helpers/error';

class OwnerLevels {

  async deleteOneOwnerLevel(params) {
    try {
      const result = await OwnerLevel.deleteOne(params);
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('delete ownerLevel failed'));
    }
  }
  async findManyOwnerLevel(params) {
    try {
      const result = await OwnerLevel.find({}).populate("brand");
      if (result) return utils.wrapperData(result);
      else return utils.wrapperError(err.notFound('ownerLevel not found'));
    } catch (error) {
      return utils.wrapperError(err.notFound('ownerLevel not found'));
    }
  }
  async findOneOwnerLevel(params) {
    try {
      const result = await OwnerLevel.find(params).populate("brand");
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.notFound('data not found'));
    }
  }
  async insertOneOwnerLevel(data) {
    try {
      const argument = new OwnerLevel(data);
      const result = await argument.save();
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('insert ownerLevel failed'));
    }
  }
  async updateOneOwnerLevel(data, params) {
    try {
      const result = await OwnerLevel.updateOne(params,data)
      // const result = await db.OwnerLevel.update(data, params);
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('update ownerLevel failed'));
    }
  }
}

export default OwnerLevels;