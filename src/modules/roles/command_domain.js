import utils from '../../helpers/utils';
import err from '../../helpers/error';
import QueryRole from './query_domain';
import QueryBrand from '../brand/query_domain';
import moment from 'moment-timezone';

export default class CommandRole {
    constructor() {
        this.query = new QueryRole();
        this.queryBrand = new QueryBrand();
    }

    async addRole(payload) {
        const {brandId,roleName} = payload;
      
        const checkRole = await this.query.getRoleByName(roleName);

        if (checkRole.data.length != 0) {
            return utils.wrapperError(new err.conflict('role already exist'));
        }

        const data = {
            brand: brandId,
            role_name: roleName.toLowerCase(),
            is_active: true
        };
        const savedRole = await this.query.role.insertOneRole(data);
        if (savedRole.error) {
            return savedRole.error
        }
        return utils.wrapperData('add role successfully')
    }

    async updateRole(param, body) {
        const { roleName, brandId } = body;
        const role = await this.query.getRoleById(param);
        const params = { _id : param };
        const updatedData = {};
        if (role.error) {
            return utils.wrapperError(new err.notFound('role not found'));
        }

        if(roleName && roleName !== role.role_name){
            updatedData.role_name = roleName;
        }

        if(brandId && brandId !== role.brand){
            const brand = await this.queryBrand.getBrandById(brandId);
            if (brand.error) {
                return utils.wrapperError(new err.notFound('brand not match'));
            }
            updatedData.brand = brandId;
        }


        const updatedRole = await this.query.role.updateOneRole(updatedData, params);
        console.log("Data : " + updatedData);
        console.log("Param : " + param);
        if (updatedRole.error) {
            return updatedRole.error;
        }
        return utils.wrapperData('update role successfully');
    }

    async softDeleteRole(payload) {
        const { roleId } = payload;
        const role = await this.query.getRoleById(roleId);
        if (role.error) {
            return utils.wrapperError(new err.notFound('role not found'));
        }

        let data = {
            is_active: false
        };

        const params = {
            _id: roleId
        };
        const updatedRole = await this.query.role.updateOneRole(data, params);
        if (updatedRole.error) {
            return updatedRole.error;
        }
        return utils.wrapperData('update role successfully');
    }

    async deleteRole(payload) {
        const {roleId} = payload;
        const role = await this.query.getRoleById(roleId);
        if (role.error) {
            return utils.wrapperError(new err.notFound('role not match'));
        }
        
        const param = {
            role_id: roleId
        };
        const deletedRole = await this.query.role.deleteOneRole(param);
        if (deletedRole.error) {
            return deletedRole.error;
        }
        return utils.wrapperData('delete role successfully')
    }
}