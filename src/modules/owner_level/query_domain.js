import OwnerLevel from './repositories';
import utils from '../../helpers/utils';

export default class QueryOwnerLevel {
    constructor() {
        this.ownerLevel = new OwnerLevel();
    }

    async getOwnerLevelById(ownerLevelId) {
        const param = {
            _id: ownerLevelId
        };
        const {data, error} = await this.ownerLevel.findOneOwnerLevel(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getOwnerLevelByBrandId(brandId) {
        const param = {
            brand: brandId
        };
        const {data, error} = await this.ownerLevel.findOneOwnerLevel(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getOwnerLevelByName(ownerLevelName) {
        const param = {
            owner_level: ownerLevelName
        };
        const {data, error} = await this.ownerLevel.findOneOwnerLevel(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getOwnerLevels() {
        const {data, error} = await this.ownerLevel.findManyOwnerLevel({});
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }
}