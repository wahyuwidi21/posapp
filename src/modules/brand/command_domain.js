import utils from '../../helpers/utils.js';
import err from '../../helpers/error.js';
import QueryBrand from './query_domain.js';
import moment from 'moment-timezone';

export default class CommandBrand {
    constructor() {
        this.query = new QueryBrand();
    }

    async addBrand(payload) {
        const {brandName, officeAddress, picName, picPhone} = payload;
        const now = moment().tz('Asia/Jakarta').format();
        const checkBrand = await this.query.getBrandByName(brandName);
        if (checkBrand.data.length != 0) {
            return utils.wrapperError(new err.conflict('brand already exist'));
        }

        const data = {
            brand_name: brandName,
            office_address:officeAddress,
            pic_name:picName,
            pic_phone:picPhone,
            is_active: true
        };
        const savedBrand = await this.query.brand.insertOneBrand(data);
        if (savedBrand.error) {
            return savedBrand.error
        }
        return utils.wrapperData('add brand successfully')
    }

    async updateBrand(params,payload) {
        const {brandName, officeAddress, picName, picPhone, isActive} = payload;

        const brand = await this.query.getBrandById(params);
        if (brand.error) {
            return utils.wrapperError(new err.notFound('brand not found'));
        }
        const currentData = brand.data;
        let updatedData = {};

        if (brandName && brandName !== currentData.brandName) {   
            updatedData.brand_name = brandName;
        }

        if (officeAddress && officeAddress !== currentData.officeAddress) {   
            updatedData.office_address = officeAddress;
        }

        if (picName && picName !== currentData.picName) {   
            updatedData.pic_name = picName;
        }

        if (picPhone && picPhone !== currentData.picPhone) {   
            updatedData.pic_phone = picPhone;
        }

        if (isActive && isActive !== currentData.isActive) {   
            updatedData.is_active = isActive;
        }

        const param = {
            _id: params
        };
        const updatedBrand = await this.query.brand.updateOneBrand(updatedData, param);
        if (updatedBrand.error) {
            return updatedBrand.error;
        }
        return utils.wrapperData('update brand successfully');
    }

    async softDeleteBrand(payload) {
        const { brandId } = payload;
        const brand = await this.query.getBrandById(brandId);
        if (brand.error) {
            return utils.wrapperError(new err.notFound('brand not found'));
        }

        let data = {
            is_active: false
        };

        const params = {
            _id: brandId
        };
        const updatedBrand = await this.query.brand.updateOneBrand(data, params);
        if (updatedBrand.error) {
            return updatedBrand.error;
        }
        return utils.wrapperData('update brand successfully');
    }

    async deleteBrand(payload) {
        const {brandId} = payload;
        const brand = await this.query.getBrandById(brandId);
        if (brand.error) {
            return utils.wrapperError(new err.notFound('brand not match'));
        }
        
        const param = {
            brand_id: brandId
        };
        const deletedBrand = await this.query.brand.deleteOneBrand(param);
        if (deletedBrand.error) {
            return deletedBrand.error;
        }
        return utils.wrapperData('delete brand successfully')
    }
}