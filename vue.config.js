const path = require('path');

const port = 3096; // 端口配置

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0', // host
        port: port,
        proxy: {
            '/admin': {
                // target: 'http://192.168.100.62:10101',   //本地
                target: 'https://testadminapi.chaying9.com',//测试
                // target: 'http://adminapi.super-radar.com',//正式
                changOrigin: true,  //允许跨域
                ws: true
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    }
};