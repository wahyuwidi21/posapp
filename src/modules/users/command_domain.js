import utils from "../../helpers/utils.js";
import err from "../../helpers/error.js";
import QueryUser from "./query_domain.js";
import QueryRole from "../roles/query_domain.js";
import QueryOwnerLevel from "../owner_level/query_domain.js";
import QueryBrand from "../brand/query_domain.js";
import bcrypt from "bcrypt";
import moment from "moment-timezone";
import jwt from "jsonwebtoken";
import mailer from "../../helpers/mailer.js";
import fs from "fs";
import mustache from "mustache";
import Redis from "../../helpers/redis.js";
import minio from "../../helpers/minio.js";
import path from "path";

const REDIS_CLIENT_CONFIGURATION = {
  connection: {
    host: process.env.REDIS_CLIENT_HOST,
    port: process.env.REDIS_CLIENT_PORT,
    password: process.env.REDIS_CLIENT_PASSWORD,
  },
  index: process.env.REDIS_INDEX,
};
const redisClient = new Redis(REDIS_CLIENT_CONFIGURATION);

export default class CommandUser {
  constructor() {
    this.query = new QueryUser();
    this.queryRole = new QueryRole();
    this.queryBrand = new QueryBrand();
    this.queryOwnerLevel = new QueryOwnerLevel();
    this.path = path;
    this.assetsUrl = `https://${process.env.MINIO_END_POINT}`;
  }

  async decryptHash(plainText, hash) {
    const ctx = "decryptHash";
    try {
      const result = await bcrypt.compare(plainText, hash);
      return result;
    } catch (error) {
      // logger.log(ctx, error, 'unknown error');
    }
  }

  async deleteUser(payload) {
    const { userId, roleId } = payload;
    const role = await this.queryRole.getRoleById(roleId);
    if (role.error) {
      return utils.wrapperError(new err.notFound("role not match"));
    }
    if (role.data.role_name.toLowerCase() !== "super admin") {
      return utils.wrapperError(
        new err.forbidden("role does has permission to delete")
      );
    }
    const param = {
      where: { user_id: userId },
    };
    const deletedUser = await this.query.user.deleteOneUser(param);
    if (deletedUser.error) {
      return deletedUser.error;
    }
    return utils.wrapperData("delete user successfully");
  }

  async generateHash(plainText) {
    const ctx = "getSha";
    try {
      const saltRounds = 10;
      const result = await bcrypt.hash(plainText, saltRounds);
      return result;
    } catch (error) {
      // logger.log(ctx, error, 'unknown error');
    }
  }

  async login(payload) {
    const { email, password } = payload;
    const emailValid = email.toLowerCase();
    const checkUser = await this.query.getUserByEmail(emailValid);
    if (checkUser.error) {
      return utils.wrapperError(err.unauthorized("email not registered"));
    }
    if (checkUser.data.is_active === false) {
      return utils.wrapperError(err.unauthorized("user is blocked"));
    }
    const checkPasswd = await this.decryptHash(
      password,
      checkUser.data.password
    );
    if (!checkPasswd) {
      return utils.wrapperError(err.unauthorized("password not match"));
    }
    const data = {
      userId: checkUser.data.user_id,
      roleId: checkUser.data.role_id,
    };
    const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "24h" });
    return utils.wrapperData({
      user_id: checkUser.data.user_id,
      email: checkUser.data.email,
      fullname: checkUser.data.fullname,
      profile_picture: this.assetsUrl + checkUser.data.profile_picture,
      token,
    });
  }

  async register(payload) {
    const {
      email,
      fullName,
      phoneNumber,
      password,
      photo,
      nik,
      ktpPicture,
      selfieWithKtp,
      npwp,
      npwpPicture,
      address,
      subDistrict,
      district,
      city,
      province,
      latitude,
      longitude,
      ownerLevelId,
      brandId,
      roleId,
    } = payload;

    const emailValid = email.toLowerCase();
    let role = "";
    let brand = "";
    const checkUser = await this.query.getUserByEmail(emailValid);
    if (checkUser.data.length != 0) {
    console.log(checkUser.data.length);
      return utils.wrapperError(err.conflict("email has been registered"));
    }

    if (roleId) {
      const dataRole = await this.queryRole.getRoleById(roleId);
      if (dataRole.error) {
        return dataRole.error;
      }
      role = dataRole.data._id;
    }

    if (brandId) {
        const dataBrand = await this.queryBrand.getBrandById(brandId);
        if (dataBrand.error) {
          return dataBrand.error;
        }
        brand = dataBrand.data._id;
    }
  
    const pwd = await this.generateHash(password);
    const userData = {
      full_name:fullName,
      email: emailValid,
      is_email_confirmed:false,
      phone_number: phoneNumber,
      is_phone_number_confirmed:false,
      password: pwd,
      photo:photo,
      nik:nik,
      ktp_picture: ktpPicture,
      selfie_with_ktp:selfieWithKtp,
      npwp:npwp,
      npwp_picture:npwpPicture,
      address:address,
      sub_district:subDistrict,
      district:district,
      city:city,
      province:province,
      latitude:latitude,
      longitude:longitude,
      owner_level:ownerLevelId,
      brand:brandId,
      role: roleId,
      is_active:true,
    };
    const saveUser = await this.query.user.insertOneUser(userData);
    if (saveUser.error) {
      return saveUser.error;
    }
    return utils.wrapperData("register successfully");
  }

  async resetPasswd(email) {
    const emailValid = email.toLowerCase();
    const checkUser = await this.query.getUserByEmail(emailValid);
    if (checkUser.error) {
      return utils.wrapperError(err.unauthorized("email not registered"));
    }
    const token = await this.generateHash(checkUser.data.user_id);
    await redisClient.setDataEx(
      `RESET_PWD_${checkUser.data.user_id}`,
      token,
      3600
    );
    const link = `${process.env.LINK_RESET_PASSWORD}?auth=${token}&userId=${checkUser.data.user_id}`;

    const tmp = fs.readFileSync(
      "./src/helpers/templates/reset_password.html",
      "utf8"
    );
    const body = mustache.render(tmp, { link });

    const mailOpt = {
      from: "test.paper.id@gmail.com",
      to: "fortaaruf.co.id@gmail.com",
      subject: "Reset Password",
      html: body,
    };
    mailer.sendMail(mailOpt, (error, data) => {
      if (error) {
        return utils.wrapperError(
          new err.internalServerError("Email failed to sent")
        );
      } else {
        console.log(data.messageId);
      }
    });

    return utils.wrapperData("reset password has been send to email");
  }

  async setStatus(payload) {
    const { userId, status, roleId } = payload;

    const checkUser = await this.query.getUserById(userId);
    if (checkUser.error) {
      return checkUser.error;
    }
    if (checkUser.data.is_active === status) {
      return utils.wrapperData("set status user successfully");
    }

    const checkRole = await this.queryRole.getRoleById(roleId);
    if (checkRole.error) {
      return checkRole.error;
    }
    if (checkRole.data.role_name.toLowerCase() !== "super admin") {
      return utils.wrapperError(
        new err.forbidden("role does has permission to set status user")
      );
    }

    const updateData = {
      is_active: status,
      updated_at: moment().tz("Asia/Jakarta").format(),
    };
    const params = {
      where: { user_id: userId },
    };
    const updatedUser = await this.query.user.updateOneUser(updateData, params);
    if (updatedUser.error) {
      return utils.wrapperError(updatedUser.error);
    }
    return utils.wrapperData("set status user successfully");
  }

  async updateResetPasswd(payload) {
    const { password, token, userId } = payload;

    const checkUser = await this.query.getUserById(userId);
    if (checkUser.error) {
      return utils.wrapperError(err.notFound("user not found"));
    }

    const key = `RESET_PWD_${checkUser.data.user_id}`;
    const getTokenRedis = await redisClient.getData(key);
    if (!getTokenRedis) {
      return utils.wrapperError(new err.unauthorized("invalid token"));
    }
    const tempToken = JSON.parse(getTokenRedis);
    const tokenRedis = tempToken.data;

    if (tokenRedis !== token) {
      return utils.wrapperError(new err.unauthorized("invalid token"));
    }

    if ((await this.decryptHash(userId, token)) === false) {
      return utils.wrapperError(new err.unauthorized("invalid user token"));
    }

    const newPasswd = await this.generateHash(password);
    const dataUpdate = {
      password: newPasswd,
      updated_at: moment().tz("Asia/Jakarta").format(),
    };
    const params = {
      where: { user_id: userId },
    };
    const updatedUser = await this.query.user.updateOneUser(dataUpdate, params);
    if (updatedUser.error) {
      return utils.wrapperError(updatedUser.error);
    }
    await redisClient.deleteKey(key);
    return utils.wrapperData("succes reset password");
  }

  async updateUser(payload) {
    const {
      userId,
      fullName,
      email,
      oldPassword,
      password,
      roleId,
      phoneNumber,
      photo,
      nik,
      ktpPicture,
      selfieWithKtp,
      npwp,
      npwpPicture,
      address,
      subDistrict,
      district,
      city,
      province,
      latitude,
      longitude,
      ownerLevelId,
      brandId
    } = payload;
    const user = await this.query.getUserById(userId);
    if (user.error) {
      return utils.wrapperError(new err.notFound("user not found"));
    }

    const userData = user.data;
    let updateData = {};

    updateData.fullname = fullname;

    if (roleId && roleId !== userData.role) {
      const role = await this.queryRole.getRoleById(roleId);
      if (role.error) {
        return utils.wrapperError(new err.notFound("role not match"));
      }
      updateData.role_id = roleId;
    }

    if (brandId && brandId !== userData.brand) {
      const brand = await this.queryBrand.getBrandById(brandId);
      if (brand.error) {
        return utils.wrapperError(new err.notFound("brand not match"));
      }
      updateData.brand_id = brandId;
    }

    if (ownerLevelId && ownerLevelId !== userData.owner_level) {
      const ownerLevel = await this.queryOwnerLevel.getOwnerLevelById(ownerLevelId);
      if (ownerLevel.error) {
        return utils.wrapperError(new err.notFound("owner level not match"));
      }
      updateData.owner_level_id = ownerLevelId;
    }

    if (fullName && fullName !== userData.full_name) {
      updateData.full_name = fullName;
    }

    if (phoneNumber && phoneNumber !== userData.phone_number) {
      updateData.phone_number = phoneNumber;
    }

    if (photo && photo !== userData.photo) {
      updateData.photo = photo;
    }

    if (nik && nik !== userData.nik) {
      updateData.nik = nik;
    }

    if (ktpPicture && ktpPicture !== userData.ktp_picture) {
      updateData.ktp_picture = ktpPicture;
    }

    if (selfieWithKtp && selfieWithKtp !== userData.selfie_with_ktp) {
      updateData.selfie_with_ktp = selfieWithKtp;
    }

    if (npwp && npwp !== userData.npwp_picture) {
      updateData.npwp_picture = npwpPicture;
    }

    if (address && address !== userData.address) {
      updateData.address = address;
    }

    if (subDistrict && subDistrict !== userData.sub_district) {
      updateData.sub_district = subDistrict;
    }

    if (district && district !== userData.district) {
      updateData.district = district;
    }

    if (city && city !== userData.city) {
      updateData.city = city;
    }

    if (province && province !== userData.province) {
      updateData.province = province;
    }

    if (latitude && latitude !== userData.latitude) {
      updateData.province = province;
    }

    if (longitude && longitude !== userData.longitude) {
      updateData.longitude = longitude;
    }

    if (password) {
      if (!oldPassword) {
        return utils.wrapperError(new err.badRequest("old password required"));
      }
      const checkPasswd = await this.decryptHash(
        oldPassword,
        userData.password
      );
      if (!checkPasswd) {
        return utils.wrapperError(err.badRequest("old password not match"));
      }
      if (password !== oldPassword)
        updateData.password = await this.generateHash(password);
    }

    if (email !== userData.email) {
      const emailValid = email.toLowerCase();
      const checkUser = await this.query.checkUserByEmail(emailValid);
      if (checkUser.data) {
        return utils.wrapperError(err.conflict("email has been registered"));
      }
      updateData.email = emailValid;
    }

    if (profilePicture) {
      console.log(profilePicture);
      if (userData.profile_picture) {
        const pathUrl = userData.profile_picture.split("/");
        const nameFile = pathUrl.pop();
        const directory = pathUrl.pop();
        await this.removeImagesMinio({
          bucket: "users",
          directory,
          name: ("", nameFile),
        });
      }
      updateData.profile_picture = await this.uploadImagesMinio({
        bucket: "users",
        directory: "profile-picture",
        file: profilePicture,
      });
    }

    const params = {
      where: { user_id: userId },
    };
    const updatedUser = await this.query.user.updateOneUser(updateData, params);
    if (updatedUser.error) {
      return utils.wrapperError(updatedUser.error);
    }
    return utils.wrapperData("update user successfully");
  }

  async uploadImagesMinio(data) {
    const ctx = "uploadImagesMinio";
    const filename = data.file.name;
    const fileExt = this.path.extname(filename);
    const newFilename = uuidv4() + fileExt;
    let file = "";
    const bucket = data.bucket;
    const key = `${data.directory}/${newFilename}`;
    const upload = await minio.objectUpload(bucket, key, data.file.path);
    console.log("upload", upload);
    if (!upload.err) {
      file = `/${bucket}/${key}`;
      fs.unlinkSync(data.file.path);
      //   logger.log(ctx, 'success', 'Succes upload file');
    } else {
      file = `/${bucket}/default_picture.png`;
      //   logger.log(ctx, 'error', 'Failed upload file', upload.err);
    }
    return file;
  }

  async removeImagesMinio(data) {
    const ctx = "removeImagesMinio";
    const bucket = data.bucket;
    const file = `${data.directory}/${data.name}`;
    const remove = await minio.objectRemove(bucket, file);
    console.log("remove", remove);
    if (!remove.err) {
      console.log("Succes remove file");
      //   logger.log(ctx, 'success', 'Succes remove file');
    } else {
      //   logger.log(ctx, 'error', 'Failed remove file', remove.err);
    }
    return remove;
  }
}
