# MOBA_VIS
This Visual Analytics System is built based on JsonVee, an efficient front-end integration framework，Based on Node.js, Vue.js, Express.js, Webpack.
More ducuments could be found under the dir [/thesis](https://github.com/mobaVis/System/tree/master/thesis)

## Overview
#### Frontend Demo GIF
![moba_demo](https://user-images.githubusercontent.com/43395416/224473362-5eb44957-a4f5-4a6e-83d1-5efc9c013599.gif)
#### Architecture Structure Overview
![image](https://user-images.githubusercontent.com/43395416/198819039-77f51b88-6cb5-46b3-981f-e1073c8159e0.png)



## Dependence
1. Webpack5, Vue 3.0, MongoDB
2. node >=v16
3. `npm install` to install all dependencies in `packages.json`

## Usage
1. run the server
    ```bash
    npm run server
    ```
2. run the client
    ```bash
    npm run start
    ```
3. build the project
    ```bash
    npm run build
    ```
    此时会执行webpack的构建，目标文件会放到public目录

## steps for three.js

1. `npm run build`
2. `npm run server`
3. Open in browser: [http://localhost:8050/#/detail](http://localhost:8050/#/detail)


**Note：key configurations are in `build/webpack.prod.conf.js`，where you can find `CopyPlugin`**

## Debug with `npm start`:

comment lines related to `closeup` models

## Directories
--- `/project`
-------- `/build`   // 打包相关逻辑，一般不用动.    
-------- `/config`  // 环境配置文件，本地环境和生产环境.    
-------- `/public `   // 生产环境打包完后，就可以把这个目录发布到服务器.    
-------- `/client `.    
-------------- `/assets `   // 资源文件目录，存放图片、样式、字体等.    
-------------- `/common `   // 公共脚本，存放一些工具函数，工具类    
-------------- `/components `   // 存放抽象后的公司Vue组件    
-------------- `/modules `   // 主要页面逻辑以模块的形式分开    
-------------------------- `/home `   // 页面，一个页面一个目录    
-------------------------- `/detail `   // 页面，一个页面一个目录    
-------------------------- `/main.js `   // 项目中的主函数    
-------------------------- `/routers.js `   // 项目路由    
-------- `/server `    
-------------- `/config `   // 服务端的一些配置文件    
-------------- `/handler `   // 处理前端的请求    
-------------- `/middleware `   // 中间件    
-------------- `/mock `   // 本地Mock数据    
-------------- `/router `   // 路由    
-------------- `/service `   // 对Handler的进一步封装    

## About
[Three.js](https://threejs.org/)

[Vue 2.x Doc](https://vuejs.bootcss.com/)

[Vue 3.x Doc](https://v3.cn.vuejs.org/)

[Node.js Doc](http://nodejs.cn/)

[Express Framework](https://github.com/expressjs/express)
