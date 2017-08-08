## Steps on Ubuntu 14.04 LTS

### Install Nginx
[Nginx Official Link](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)
```
sudo -s
apt-get update
apt-get install software-properties-common
nginx=stable # use nginx=development for latest development version
add-apt-repository ppa:nginx/$nginx
apt-get update
apt-get install nginx
```

### Install Redis
[Redis Official Link](https://redis.io/topics/quickstart)
```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make MALLOC=libc
make install
make test
cp redis.conf /etc/redis.conf
```

**为Redis设置密码(推荐)**
```
vim /etc/redis.conf
```
编辑设置取消`requirepass`的注释并跟随填写你的密码
编辑设置`daemonize no`更改为`daemonize yes`

```
redis-server /etc/redis.conf // 启动redis-server
```

### Install NodeJS
[NodeJS Official Link](https://nodejs.org/en/download/current/)

```
mkdir /usr/lib/nodejs
cd /usr/lib/nodejs
wget https://nodejs.org/dist/v8.2.1/node-v8.2.1-linux-x64.tar.xz
xz -d node-v8.2.1-linux-x64.tar.xz
tar xf node-v8.2.1-linux-x64.tar
mv node-v8.2.1-linux-x64 node-v8.2.1
ln -s /usr/lib/nodejs/node-v8.2.1/bin/node /usr/local/bin/node
ln -s /usr/lib/nodejs/node-v8.2.1/bin/npm /usr/local/bin/npm
```

### Clone Code
```
mkdir /home/wwwroot
cd /home/wwwroot
git clone https://github.com/thundernet8/COS-As-ImageService.git COS
git clone https://github.com/thundernet8/Swift-Pictures-Web.git COS-Web // 修改index.html内部uploadUrl为实际上传接口地址
cd COS
cp envrc.sample envrc
vim envrc // 填充必要的变量
npm install
npm run start
```

### Nginx conf
参考nginx文件夹配置项文件
***SSL证书可使用LetEncrypt的免费证书，使用autobot工具自动申请***