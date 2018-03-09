/**
 * webpack 配置项
 * 1、JS模块化开发
 * 2、SASS，CSS抽离
 * 3、sourceMap 配置
 * 4、代理配置
 * 5、压缩
 * 6、版本控制
 */

let env = process.env.NODE_ENV.match(/bulid/) ? 'bulid' : 'dev'

let webpack           = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

let webpackSetting = {
    // 入口配置
    entry  : {
        'script/index': './src/script/index.js'   // Chunk名：文件相对地址
    },
    // 出口配置
    output : {
        filename: env == 'dev' ? '[name].js' : '[name]@[chunkhash:8].js',  // [name]是Chunk名
        path    : __dirname + '/' + env + '/'     // 必须要绝对路径，__dirname是node的一个常量，表示当前文件的所有路径
    },
    // 开发工具
    devtool: env == 'dev' ? 'source-map' : false,
    // 模块配置
    module : {
        rules: [
            // scss
            {
                test   : /\.scss$/,
                exclude: /node_modules/,
                use    : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use     : [
                        { loader: 'css-loader', options: { minimize: env == 'bulid' } },
                        { loader: 'sass-loader', options: { outputStyle: env == 'bulid' ? 'compressed' : ' expanded' } }
                    ]
                })
            },
            // css
            {
                test   : /\.css$/,
                exclude: /node_modules/,
                use    : [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { minimize: env == 'bulid' } }
                ]
            },
            // js
            {
                test   : /\.js$/,
                exclude: /node_modules/,
                use    : [
                    { loader: 'babel-loader' }
                ]
            },
            // img
            {
                test   : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader : 'url-loader',
                options: {
                    limit: 4094, name: 'images/[name].[ext]'
                }
            }
        ]
    },
    // 插件配置
    plugins: [
        // css 抽离
        new ExtractTextPlugin({
            filename : getPath => getPath(env == 'dev' ? '[name].css' : '[name]@[chunkhash:8].css').replace('script', 'style'),
            allChunks: true
        }),
        // index文件自动加css,script
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks  : ['script/index']
        })
    ]
}
if(env == 'bulid'){
    // 压缩JS
    webpackSetting.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            output  : { comments: false }
        })
    )
}else{
    // 配置webserver
    webpackSetting.devServer = {
        host       : 'localhost',
        port       : 12138,
        contentBase: __dirname + '/dev',
        noInfo     : true
        // proxy      : {
        //     '/api': {
        //         target      : 'https://m.lagou.com/',
        //         changeOrigin: true,
        //         pathRewrite : {
        //             '^/api': ''
        //         }
        //     }
        // }
    }
}

module.exports = webpackSetting