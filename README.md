## COS-As-ImageService
Image upload/download service with Tecent COS

## Demo
[Demo site](https://fuli.news)

## 部署
### 申请腾讯云对象存储COS服务实例以及CDN服务(可选)
### 个人服务器安装
  * [x] NodeJS
  * [x] Redis(用于存储删除链接相关信息)
  * [x] Nginx(反代上传以及删除接口服务至对应node端，上传静态页面位于web文件夹下，静态网站处理)
  * [x] forever | pm2 (持久运行node程序)
### 环境变量
***重要的key,password等信息将作为环境变量,拷贝envrc.sample为envrc并填写必要的信息***

**注意：如果使用了CDN，要设置CDN管理该对象存储域名的HTTP Header,添加Content-Disposition:inline**

详细见[Help](./help.md)