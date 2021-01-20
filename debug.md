## 避免egret项目在debug模式下打开多个浏览器窗口，进行以下配置

1、.vscode\launch.json =>	configurations => url 查看端口号

2、scripts\config.ts => new WebpackDevServerPlugin 

​	open: false,

​	port: .vscode\launch.json 找到的端口号