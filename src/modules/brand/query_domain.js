import Brand from './repositories.js';
import utils from '../../helpers/utils.js';

export default class QueryBrand {
    constructor() {
        this.brand = new Brand();
    }

    async getBrandById(brandId) {
        const param = {
            _id: brandId
        };
        const {data, error} = await this.brand.findOneBrand(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getBrandByName(brandName) {
        const param = {
            brand_name: brandName
        };
        const {data, error} = await this.brand.findOneBrand(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getBrands() {
        const {data, error} = await this.brand.findManyBrand({});
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }
}