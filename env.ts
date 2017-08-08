import * as path from "path";

// Init process.env
require("dotenv").config({ path: path.resolve(__dirname, "./envrc") });

export const isDev = process.env.NODE_ENV !== "production";
export const isProd = process.env.NODE_ENV === "production";

export const UPLOAD_HOST = isProd ? "127.0.0.1" : "0.0.0.0";
export const UPLOAD_PORT = isProd ? 8001 : 3001;

export const DELETE_HOST = isProd ? "127.0.0.1" : "0.0.0.0";
export const DELETE_PORT = isProd ? 8002 : 3002;

export const UPLOAD_ALLOW_ORIGIN = [
    "https://fuli.news",
    "http://fuli.news",
    "http://127.0.0.1:8088"
];
export const DELETE_ALLOW_ORIGIN = [
    "https://fuli.news",
    "http://fuli.news",
    "http://127.0.0.1:8088"
];

// Public host
export const PUBLIC_DOWNLOAD_HOST = "https://i.fedepot.com"; // 如果启用了CDN自定义域名，在这里填写
export const PUBLIC_UPLOAD_HOST = "https://s.fuli.news";
export const PUBLIC_DELETE_HOST = "https://s.fuli.news";

// File options
export const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // bytes
export const IMAGE_UPLOAD_COUNT_LIMIT = 5;
export const IMAGE_ALLOW_MIMES = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/bmp",
    "image/bitmap",
    "image/tiff"
];

// Redis
export const REDIS_HOST = process.env.OS_REDIS_HOST || "127.0.0.1";
export const REDIS_PORT = process.env.OS_REDIS_PORT || 6379;
export const REDIS_PASSWORD = process.env.OS_REDIS_PASSWORD || "";

// COS options
export const COS_BUCKET_NAME = process.env.COS_BUCKET_NAME as string;
export const COS_REGION_NAME = process.env.COS_REGION_NAME as string;
export const COS_APPID = process.env.COS_APPID as string;
export const COS_SECRET_ID = process.env.COS_SECRET_ID;
export const COS_SECRET_KEY = process.env.COS_SECRET_KEY;
