
import Minio from 'minio';
import utils from './utils.js';

let minioClient;

const init = () => {
  minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    useSSL: true,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });
//   logger.log('minio-init', 'minio initialized', 'info');
};
const isBucketExist = (bucketName) => {
    return new Promise((resolve, reject) => {
      minioClient.bucketExists(bucketName, (err, exists) => {
        if (err) {
        //   logger.log('minioSdk-isBucketExist', err.message, 'error check bucket');
          reject(err);
        }
        resolve(exists ? true : false);
      });
    });
  };
  const bucketCreate = async (bucketName, region = 'us-east-1') => {
    try {
      const isExists = await isBucketExist(bucketName);
      if (isExists) {
        return utils.wrapperData(true);
      }
      await minioClient.makeBucket(bucketName, region);
      return utils.wrapperData(true);
    } catch (err) {
    //   logger.log('minioSdk-bucketCreate', err.message, 'error create bucket');
      return utils.wrapperError(err);
    }
  };
  const bucketRemove = async (bucketName) => {
    try {
      await minioClient.removeBucket(bucketName);
      return utils.wrapperData(true);
    } catch (err) {
    //   logger.log('minioSdk-bucketRemove', err.message, 'error remove bucket');
      return utils.wrapperError(err);
    }
  };
  const objectUpload = async (bucketName, objectName, filePath) => {
    try {
      const isUploaded = await minioClient.fPutObject(bucketName, objectName, filePath);
      if (isUploaded) {
        return utils.wrapperData(isUploaded);
      }
    } catch (err) {
    //   logger.log('minioSdk-objectUpload', err.message, 'error upload object');
      return utils.wrapperError(err);
    }
  };
  const objectDownload = async (bucketName, objectName, filePath) => {
    try {
      const isDownloaded = await minioClient.fGetObject(bucketName, objectName, filePath);
      if (isDownloaded) {
        return utils.wrapperData(isDownloaded);
      }
    } catch (err) {
    //   logger.log('minioSdk-objectDownload', err.message, 'error download object');
      return utils.wrapperError(err);
    }
  };
  const objectRemove = async (bucketName, objectName) => {
    try {
      await minioClient.removeObject(bucketName, objectName);
      return utils.wrapperData(true);
    } catch (err) {
    //   logger.log('minioSdk-objectRemove', err.message, 'error remove object');
      return utils.wrapperError(err);
    }
  };
  const objectGetUrl = async (bucketName, objectName, expiry = 604800) => {
    try {
      const getUrl = await minioClient.presignedGetObject(bucketName, objectName, expiry);
      return utils.wrapperData(getUrl);
    } catch (err) {
    //   logger.log('minioSdk-objectUrl', err.message, 'error get object url');
      return utils.wrapperError(err);
    }
  };
  
 export default {
    init,
    bucketCreate,
    bucketRemove,
    objectUpload,
    objectGetUrl,
    objectDownload,
    objectRemove
  };