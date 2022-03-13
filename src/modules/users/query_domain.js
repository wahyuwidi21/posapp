import User from './repositories.js';
import Brand from '../brand/repositories.js';
import utils from '../../helpers/utils.js';
import { Op } from 'sequelize';

export default class QueryUser {
    constructor() {
        this.user = new User();
        this.brand = new Brand();
        this.assetsUrl = `https://${process.env.MINIO_END_POINT}`;
    }

    async checkUserByEmail(email) {
        const param = {
            email: email
        };
        const {error} = await this.user.findOneUser(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData('email registered');
    }

    async getUserByEmail(email) {
        const param = {
            email: email
        };
        const {data, error} = await this.user.findOneUser(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getUserById(userId) {
        const param = {
            _id: userId
        };
        const {data, error} = await this.user.findOneUser(param);
        if (error) {
            return utils.wrapperError(error);
        }
        data.profile_picture = (data.profile_picture !== '') ? this.assetsUrl + data.profile_picture : data.profile_picture;
        return utils.wrapperData(data);
    }

    async getUserByBrandId(brandId) {
        const param = {
            brand: brandId
        };
        const {data, error} = await this.user.findOneUser(param);
        if (error) {
            return utils.wrapperError(error);
        }
        data.profile_picture = (data.profile_picture !== '') ? this.assetsUrl + data.profile_picture : data.profile_picture;
        return utils.wrapperData(data);
    }

    async getUsers(payload) {
        const { search, page, limit } = payload;
        let params = {};
        if (search) {
            console.log(search);
            params = {$or:[{
            full_name: {$regex: '.*' + search + '.*'}    
            },{
                email: {$regex: '.*' + search + '.*'}    
                }]}
        }
    
        const {data, error} = await this.user.findAndCountAllUser(params);
        if (error) {
            return utils.wrapperError(error);
        }
        const meta = {
            limit,
            page,
            totalData: data.count,
            totalPage: Math.ceil(data.count/limit)
        }
        data.rows = data.rows.map(v => {
            if (v.profile_picture !== '') v.profile_picture = this.assetsUrl + v.profile_picture;
            return v;
        });
        return utils.wrapperDataPagination(data.rows, meta);
    }


    async getUsersByBrandId(payload) {
        const { search, brandId, page, limit } = payload;
        let searchParams = []
        if (search) {
            searchParams.push({
            full_name: {$regex: '.*' + search + '.*'}    
            });
            searchParams.push({
                email: {$regex: '.*' + search + '.*'}    
                });
        } else{
            searchParams.push({});
        }
        
     
        let brand =  {
            brand: brandId  
        };
        let param = {$and:[brand,{$or:searchParams}]}
        console.log(param);
        const {data, error} = await this.user.findAndCountAllUser(param);
        if (error) {
            return utils.wrapperError(error);
        }
        const meta = {
            limit,
            page,
            totalData: data.count,
            totalPage: Math.ceil(data.count/limit)
        }
        data.rows = data.rows.map(v => {
            if (v.profile_picture !== '') v.profile_picture = this.assetsUrl + v.profile_picture;
            return v;
        });
        return utils.wrapperDataPagination(data.rows, meta);
    }
}