# 虚空白板
## 部署流程
提示：我们推荐的服务器系统是`Ubuntu 22.04 LTS`，因为这是经过测试的；另外，作者测试使用的`Kali GNU/Linux 2023.4`亦能够正常部署。若使用其它操作系统，不能保证稳定性，需要自行测试并查找解决方案。对于nginx版本，请保持使用最新版本，若使用过旧的版本，不能保证正常运行。
1. 将电子教室完整的置于服务器的一个目录下
2. 构建计时器应用
在项目目录下打开终端
```bash
cd timer
yarn
yarn build
```
若timer目录下多出一个dist文件夹，则成功构建
1. 配置nginx(务必保证服务器已安装nginx)
```bash
sudo systemctl start nginx //启动nginx
sudo systemctl status nginx //运行状态
cd /etc/nginx/ //切换到nginx目录
sudo vi nginx.conf //编辑配置文件
```
请在nginx配置文件的http内插入如下内容
```conf
server {
  listen 端口号;
  server_name IP或域名;
  root 静态文件目录;

  error_page 404 500 502 503 504 /error;

  location / {
    index index.html;
  }

  location /name/ {
    try_files $uri /name.html;
  }

  location /timer/ {
    try_files $uri /timer/dist/index.html;
  }

  location /draw/ {
    try_files $uri /draw.html;
  }

  location /author.html/ {
    try_files $uri /author.html;
  }

  location /error/ {
    try_files $uri /error.html;
  }

  location /statics/ {
    alias 静态文件目录/statics/;
  }

  location /assets/ {
    alias 静态文件目录/timer/dist/assets/;
  }
}
```
为避免出现权限问题，建议修改配置文件首行为
```conf
user root
```
修改完成后，保存退出文件，执行如下命令
```bash
sudo nginx -t //测试nginx配置文件是否存在错误
sudo systemctl reload nginx //重载nginx使配置文件生效
```
至此，配置完成，请访问页面进行测试。
