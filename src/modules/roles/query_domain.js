import Role from './repositories';
import utils from '../../helpers/utils';

export default class QueryRole {
    constructor() {
        this.role = new Role();
    }

    async getRoleById(roleId) {
        const param = {
            _id: roleId
        };
        const {data, error} = await this.role.findOneRole(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getRoleByBrandId(brandId) {
        const param = {
            brand: brandId
        };
        const {data, error} = await this.role.findOneRole(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getRoleByName(roleName) {
        const param = {
            role_name: roleName
        };
        const {data, error} = await this.role.findOneRole(param);
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }

    async getRoles() {
        const {data, error} = await this.role.findManyRole({});
        if (error) {
            return utils.wrapperError(error);
        }
        return utils.wrapperData(data);
    }
}