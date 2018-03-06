# GCwap Pc版 架构框架
>提示: 确保你正在使用node

### 快速开始

```
bash
# clone our repo
$ git clone xxx

# install the dependencies with npm
$ npm install

# start the server
$ npm start
```


## 启动

安装完所有依赖之后你可以执行以下脚本来启动程序:
```
npm start
```

使用本地服务`webpack-dev-server`监听，创建和热加载。
端口暂为5000`http://localhost:5000`

## 生产输出刷新404的解决办法
```
    apache: 生产产出有 .htaccess 文件，不会出现问题
    nginx: 需要在nginx 的配置中进行一下配置：
            location / {
                if (!-e $request_filename){
                    rewrite ^(.*)$ /index.html;
                }
            }
    express: 可以在app上进行路由配置：
            var express = require('express');
            var app = express();
            app.all('/*', function(req, res, next) {
                // Just send the index.html for other files to support HTML5Mode
                res.sendFile('index.html', { root: __dirname });
            });
```
## 组件中需要注意的问题：
```
    在组件中引入库时，需要保持统一，例如：
    import $ from 'jQuery'
    import angular from 'angular'
    注意不要写成:
    import $ from 'jquery'
    import angular from 'Angular'
    注意大小写统一
```
## 关于node版本的问题说明
    建议统一node版本，否则可能会出现配置不兼容的问题
    当前版本为5.5.0 stable版

## 生产版本中如果出现tProvider undefined，在webpack.prod.js中的UglifyJsPlugin中的mangle加入该provider的名字
```
mangle: {
      except: [
        '$state',
        '$stateParams',
        '$timeout',
        'Core',
        'Layer',
        'Util',
        '$location',
        '$rootScope',
        '$scope',
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$httpProvider',
        'IsDebug',
        '$httpParamSerializer',
        '$sce'
      ]
    }
```
## 引入模板的问题
    当前在$rootScope中定义了TPL_ROOT,直接include **/**.tpl.html
    例如<div ng-include="TPL_ROOT + 'nav/nav.tpl.html'"></div>

## paginate 分页的使用说明
```
    paginate的两种使用模式说明：
    MODE 1: page
        该模式是匹配路由模式，如资讯列表页的使用：
        在模板中直接使用paginate的标签：
            <paginate
                currentpage="{{page}}"
                total="{{total}}"
                goParam="{{goParam}}"
                pagesize="{{pageSize}}"
            ></paginate>
            其中，page为当前页数，total为总记录数，pageSize为每页多少条记录

paginate的属性<font style="color:red">不区分大小写</font>

            goParam为匹配路由的参数设置：
                $scope.goParam = {
                    mode: 'page',
                    url: 'news',
                    parent_id,
                    category_id: $stateParams.category_id
                }
                url为路由地址
                mode为说明使用哪种模式
                parent_id 和 category_id 为路由需要使用的参数
    MODE 2: datagrid
        该模式不匹配路由，为本页缓存数据，使用如下：
            在模板中使用paginate标签：
                <paginate
                    currentpage="{{page}}"
                    total="{{total}}"
                    goParam="{{goParam}}"
                    pagesize="{{pageSize}}"
                ></paginate>
```

<table>
    <tr><td>参数名称</td><td >使用说明</td><td>详细说明</td></tr>
    <tr><td>currentpage</td><td>当前页码</td><td></td></tr>
    <tr><td>total</td><td>总记录数</td><td></td></tr>
    <tr><td>pageSize</td><td>单页条数</td><td></td></tr>
    <tr>
        <td>goParam</td>
        <td>
            <pre>请求接口需要的参数，具体如下：
            $scope.goParam = {
                mode: 'datagrid',
                dataCache: 'news',
                url: '',
                parent_id,
                category_id: $stateParams.category_id
            }</pre>
        </td>
        <td>
            <pre>
             mode为使用模式,
            dataCache为接口返回数据存储key值
            url 为请求接口地址，这里只考虑了使用get请求
            parent_id和category_id为请求接口需要使用的参数
            </pre>
        </td>
    </tr>
    <tr>
        <td >数据获取</td>
        <td>
            <pre>
            接口返回数据成功后，统一放进$rootScope中的dataCache[key]中，
            因此在使用paginate的controller中监听dataCache[key]即可更新数据
            </pre>
        </td>
        <td></td>
    </tr>
</table>

## 待优化
    页面加载loading
    按钮loading屏蔽

## 六合彩下注规则
```
一球一注玩法：两面  特码AB 正码  正码特  正码1-6 生肖 色波  尾数  七码五行、

连码：比如四全中下注（3,4,5,8,9,10），以四个号码为一组，共20组，下注格式为一注取玩法赔率：
[{
"gid":"3",
"tid":"247",
"price":2,
"counts":20,
"price_sum":40,
"rate":"100,23",
"rebate":"0.0",
"pids":"1704,1705,1706,1709,1710,1711",
"contents":"3,4,5,8,9,10",
"names":"03,04,05,08,09,10"
}]

连肖（连尾）：比如二肖连下注（鼠，虎，龙，马），以两个号码为一组，共6组，赔率取两个号一组中最小的赔率,下注为多条
[
    {
        "gid": "3",
        "tid": "251",
        "price": 2,
        "counts": 1,
        "price_sum": 2,
        "rate": 4.12,
        "rebate": 0,
        "pids": "2100,2102",
        "contents": "129,131",
        "names": "鼠,虎",
        "atitle": "连肖",
        "btitle": "二肖连"
    },
    {
        "gid": "3",
        "tid": "251",
        "price": 2,
        "counts": 1,
        "price_sum": 2,
        "rate": 4.12,
        "rebate": 0,
        "pids": "2100,2104",
        "contents": "129,133",
        "names": "鼠,龙",
        "atitle": "连肖",
        "btitle": "二肖连"
    }
]

自选不中：取玩法赔率，下注为一条数据
[
    {
        "gid": "3",
        "tid": "259",
        "price": 2,
        "counts": 6,
        "price_sum": 12,
        "rate": "2.1",
        "rebate": "0.0",
        "pids": "2301,2302,2303,2304,2305,2310",
        "contents": "1,2,3,4,5,10",
        "names": "01,02,03,04,05,10",
        "atitle": "自选不中",
        "btitle": "五不中"
    }
]
```