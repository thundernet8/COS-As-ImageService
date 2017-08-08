import * as COS from "cos-nodejs-sdk-v5";
import * as env from "../env";
import * as Promise from "bluebird";

export const DOMAIN = `http://${env.COS_BUCKET_NAME}-${env.COS_APPID}.${env.COS_REGION_NAME}.myqcloud.com`;
export const CDN_DOMAIN =
    env.PUBLIC_DOWNLOAD_HOST ||
    `http://${env.COS_BUCKET_NAME}-${env.COS_APPID}.file.myqcloud.com`; // 可以为空，则不使用CDN加速访问资源

const cos = new COS({
    AppId: env.COS_APPID,
    SecretId: env.COS_SECRET_ID,
    SecretKey: env.COS_SECRET_KEY,
    FileParallelLimit: 10, // 控制文件上传并发数
    ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
    ChunkSize: 1024 * 1024, // 控制分片大小，单位 B
    ProgressInterval: 1000, // 控制 onProgress 回调的间隔
    Domain: "{{Bucket}}-{{AppId}}.{{Region}}.myqcloud.com"
});

// Promisify
const methods = [
    "getService",
    "headBucket",
    "getBucket",
    "putBucket",
    "deleteBucket",
    "getBucketACL",
    "putBucketACL",
    "getBucketCORS",
    "putBucketCORS",
    "deleteBucketCORS",
    "getBucketLocation",
    "getBucketTagging",
    "putBucketTagging",
    "deleteBucketTagging",
    "headObject",
    "getObject",
    "putObject",
    "deleteObject",
    "optionsObject",
    "getObjectACL",
    "putObjectACL",
    "deleteMultipleObject",
    "multipartInit",
    "multipartUpload",
    "multipartComplete",
    "multipartListPart",
    "multipartAbort",
    "multipartList",
    "sliceUploadFile"
];

methods.forEach(method => {
    cos[method] = Promise.promisify(cos[method]);
});

export default cos;
