import * as Busboy from "busboy";
import * as MD5 from "md5";
import * as SizeOf from "image-size";
import * as uuidv4 from "uuid/v4";
import cos, { DOMAIN, CDN_DOMAIN } from "../../COS";
import redisClient from "../redis";
import { getFormatDate } from "../utils";
import {
    PUBLIC_DOWNLOAD_HOST,
    IMAGE_SIZE_LIMIT,
    IMAGE_ALLOW_MIMES,
    PUBLIC_DELETE_HOST,
    COS_BUCKET_NAME,
    COS_REGION_NAME,
    isDev
} from "../../env";

// TODO 上传频度限制

const addDeleteLink = (
    bucket: string,
    region: string,
    objectName: string,
    imageUrl: string
) => {
    const key = uuidv4();
    const value = `${bucket}|${region}|${objectName}`;
    redisClient.set(key, value);
    const deleteLink = `${PUBLIC_DELETE_HOST}/delete/${key}`;
    if (isDev) {
        console.log(
            `${new Date().toISOString()}: Redis set delete link: ${deleteLink}\n    For image link: ${imageUrl}`
        );
    }
    return deleteLink;
};

export default async function(req, res) {
    if (isDev) {
        console.log(`${new Date().toISOString()}: POST ${req.url}`);
    }
    const busboy = new Busboy({ headers: req.headers });

    let params = {};
    busboy.on("field", function(
        fieldname,
        val,
        _fieldnameTruncated,
        _valTruncated
    ) {
        //console.log("Field [" + fieldname + "]: value: " + val);
        //console.log(`xxxx-${fieldnameTruncated}-${valTruncated}`);
        params[`x-cos-meta-${fieldname}`] = val;
    });

    busboy.on("file", function(
        _fieldname,
        file,
        filename,
        _encoding,
        mimetype
    ) {
        // if (encoding === "7bit") {
        //     encoding = "binary";
        // }
        let chunks: any[] = [];
        file.on("data", function(data) {
            chunks.push(data);
        });
        file.on("end", async function() {
            const resp = {
                code: 0,
                result: {},
                msg: ""
            };
            const buffer = Buffer.concat(chunks);
            const size = buffer.length;
            if (size > IMAGE_SIZE_LIMIT) {
                resp.msg = "File size exceed limit";
                res.status(400).send(resp);
            }
            if (size < 1) {
                resp.msg = "File is empty";
                res.status(400).send(resp);
            }
            if (IMAGE_ALLOW_MIMES.indexOf(mimetype.toLowerCase()) < 0) {
                resp.msg = "File has an unsupported mime type";
                res.status(400).send(resp);
            }
            const md5 = MD5(buffer);
            const demensions = SizeOf(buffer);
            const objectName = `${getFormatDate(null, "YYYY/MM/DD")}/${md5}`;
            params = Object.assign(
                {
                    Bucket: COS_BUCKET_NAME,
                    Region: COS_REGION_NAME,
                    Key: objectName,
                    CacheControl: "max-age=315360000", // 缓存10年
                    ContentType: mimetype,
                    ContentDisposition: "inline", // 重要，默认是以attachment模式，"inline"模式访问图片时直接页面内展示而不是被下载, 如果你使用CDN的话还需要至CDN中管理改对象空间域名的HTTP Header，设置Content-Disposition为inline
                    ACL: "public-read",
                    ["x-cos-meta-name"]: encodeURIComponent(filename), // 保存原始文件名
                    ["x-cos-meta-md5"]: md5,
                    ["x-cos-meta-width"]: demensions.width,
                    ["x-cos-meta-height"]: demensions.height,
                    ["x-cos-meta-size"]: size,
                    ["x-cos-meta-ip"]:
                        req.headers["x-forwarded-for"] ||
                        req.connection.remoteAddress,
                    Body: buffer,
                    onProgress: function(progressData) {
                        if (isDev) {
                            console.log(progressData);
                        }
                    }
                },
                params
            );

            // 注意需要在控制台中先创建好必要的bucket，目前只能通过这种方式创建
            return cos
                .putObject(params)
                .then(result => {
                    if (isDev) {
                        console.log(result);
                    }
                    if (result.statusCode < 200 || result.statusCode >= 300) {
                        if (isDev) {
                            console.log(
                                `${new Date().toISOString()}: put object with ${result.status} status error`
                            );
                            console.log(result);
                        }
                        resp.msg = result.data.toString();
                        res.status(result.statusCode).send(resp);
                    }
                    const path = objectName;
                    const internalUrl = `${PUBLIC_DOWNLOAD_HOST}/${path}`; // myqcloud.com默认域名链接
                    const url = `${CDN_DOMAIN || DOMAIN}/${path}`; // 自定义域名的链接
                    resp.code = 1;
                    resp.result = {
                        filename,
                        size,
                        width: demensions.width,
                        height: demensions.height,
                        internalUrl,
                        url,
                        path,
                        delete: addDeleteLink(
                            COS_BUCKET_NAME,
                            COS_REGION_NAME,
                            objectName,
                            url
                        )
                    };
                    res.status(200).send(resp);
                })
                .catch(err => {
                    resp.msg =
                        err instanceof Error
                            ? err.message
                            : err.response.data.message;
                    if (isDev) {
                        console.log(
                            `${new Date().toISOString()}: put object with error: ${resp.msg}`
                        );
                        console.log(err);
                    }
                    res.status(400).send(resp);
                });
        });
    });

    // busboy.on("finish", function() {
    //     res.writeHead(200, { Connection: "close" });
    //     res.end("done");
    // });
    return req.pipe(busboy);
}
