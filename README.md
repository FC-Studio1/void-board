# 电子教室
## 配置方法
1. 将电子教室完整的置于服务器的一个目录下
2. 配置nginx(务必保证服务器已安装nginx)
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

    location / {
        index index.html;
    }

    location /name/ {
        try_files $uri /name.html;
    }

    location /draw/ {
        try_files $uri /draw.html;
    }

    location /statics/ {
        alias 静态文件目录/statics/;
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