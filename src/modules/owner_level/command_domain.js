import utils from '../../helpers/utils.js';
import err from '../../helpers/error.js';
import QueryOwnerLevel from './query_domain.js';
import QueryBrand from '../brand/query_domain.js';
import moment from 'moment-timezone';

export default class CommandOwnerLevel {
    constructor() {
        this.query = new QueryOwnerLevel();
        this.queryBrand = new QueryBrand();
    }

    async addOwnerLevel(payload) {
        const {brandId,ownerLevelName} = payload;
      
        const checkOwnerLevel = await this.query.getOwnerLevelByName(ownerLevelName);

        if (checkOwnerLevel.data.length != 0) {
            return utils.wrapperError(new err.conflict('ownerLevel already exist'));
        }

        const data = {
            brand: brandId,
            owner_level: ownerLevelName.toLowerCase(),
            is_active: true
        };
        const savedOwnerLevel = await this.query.ownerLevel.insertOneOwnerLevel(data);
        if (savedOwnerLevel.error) {
            return savedOwnerLevel.error
        }
        return utils.wrapperData('add ownerLevel successfully')
    }

    async updateOwnerLevel(param, body) {
        const { ownerLevelName, brandId } = body;
        const ownerLevel = await this.query.getOwnerLevelById(param);
        const params = { _id : param };
        const updatedData = {};
        if (ownerLevel.error) {
            return utils.wrapperError(new err.notFound('ownerLevel not found'));
        }

        if(ownerLevelName && ownerLevelName !== ownerLevel.owner_level){
            updatedData.owner_level = ownerLevelName;
        }

        if(brandId && brandId !== ownerLevel.brand){
            const brand = await this.queryBrand.getBrandById(brandId);
            if (brand.error) {
                return utils.wrapperError(new err.notFound('brand not match'));
            }
            updatedData.brand = brandId;
        }


        const updatedOwnerLevel = await this.query.ownerLevel.updateOneOwnerLevel(updatedData, params);
        console.log("Data : " + updatedData);
        console.log("Param : " + param);
        if (updatedOwnerLevel.error) {
            return updatedOwnerLevel.error;
        }
        return utils.wrapperData('update ownerLevel successfully');
    }

    async softDeleteOwnerLevel(payload) {
        const { ownerLevelId } = payload;
        const ownerLevel = await this.query.getOwnerLevelById(ownerLevelId);
        if (ownerLevel.error) {
            return utils.wrapperError(new err.notFound('ownerLevel not found'));
        }

        let data = {
            is_active: false
        };

        const params = {
            _id: ownerLevelId
        };
        const updatedOwnerLevel = await this.query.ownerLevel.updateOneOwnerLevel(data, params);
        if (updatedOwnerLevel.error) {
            return updatedOwnerLevel.error;
        }
        return utils.wrapperData('update ownerLevel successfully');
    }

    async deleteOwnerLevel(payload) {
        const {ownerLevelId} = payload;
        const ownerLevel = await this.query.getOwnerLevelById(ownerLevelId);
        if (ownerLevel.error) {
            return utils.wrapperError(new err.notFound('ownerLevel not match'));
        }
        
        const param = {
            ownerLevel_id: ownerLevelId
        };
        const deletedOwnerLevel = await this.query.ownerLevel.deleteOneOwnerLevel(param);
        if (deletedOwnerLevel.error) {
            return deletedOwnerLevel.error;
        }
        return utils.wrapperData('delete ownerLevel successfully')
    }
}