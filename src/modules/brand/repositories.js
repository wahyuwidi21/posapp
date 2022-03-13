import utils from '../../helpers/utils.js';
import err from '../../helpers/error.js';
import brand from '../../models/brand.js';

class Brand {

  async deleteOneBrand(params) {
    try {
      const result = await brand.deleteOne(params);
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('delete brand failed'));
    }
  }
  async findManyBrand(params) {
    try {
      const result = await brand.find({});
      if (result) return utils.wrapperData(result);
      else return utils.wrapperError(err.notFound('brand not found'));
    } catch (error) {
      return utils.wrapperError(err.notFound('brand not found'));
    }
  }
  async findOneBrand(params) {
    try {
      const result = await brand.find(params);
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.notFound('data not found'));
    }
  }
  async insertOneBrand(data) {
    try {
      const argument = new brand(data);
      const result = await argument.save();
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('insert brand failed'));
    }
  }
  async updateOneBrand(data, params) {
    try {
      const result = await brand.updateOne(params,data)
      // const result = await db.Brand.update(data, params);
      return utils.wrapperData(result);
    } catch (error) {
      console.log(error)
      return utils.wrapperError(err.internalServerError('update brand failed'));
    }
  }
}

export default Brand;