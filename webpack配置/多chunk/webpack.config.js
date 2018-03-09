/**
	1.模块化开发
	2.SASS CSS的抽离
	3.sourceMap配置
	4.代理配置
	5.打包压缩
	6.版本的控制
	
*/
//引入webpack
let webpack = require('webpack');
//引入文本抽离 就是css的抽离
let ExtractTextPlugin = require('extract-text-webpack-plugin');

//引入html生成插件
let HtmlWebpackPlugin = require('html-webpack-plugin');

//这句话可以判断生产环境还是要发布的环境
// console.log(process.env.NODE_ENV === 'dev');


let env = process.env.NODE_ENV.match(/dev/) ?  "dev" : "build";
let outputDir = env === "dev" ? '/dev' : '/build';

let webPackSettings = {
	//配置入口
	entry: {
		'scripts/app': './src/scripts/app.js',
		'scripts/search': './src/scripts/search.js'
	},
	
	//配置出口
	//@直接生成版本号，想要多少位数的，写多少位数的
	output: {
		filename: env === "dev"  ?  '[name].js' : '[name]@[chunkhash:6].js',
		path: __dirname + outputDir			//必须是绝对路径
	},

	//可以生成映射文件，方便查看开发
	devtool: env === "dev" ?  'source-map' : false,
	//配置模块
	module: {
	
	//解析es6，预设的设置，需要单独创建一个.babelrc文件
	/*
		{
			"presets" : ["babel-preset-env"]
		}
	*/
		rules: [
			//解析es6
			/*test:解析的文件的范围*/
			{
				test: /\.js$/,
				exclude: /node_modules/,	//排除
				use: [
					{
						loader: 'babel-loader'	//遇到es6+的文件来这里解析
					}
				]
			},

			//加载scss 只要解析文件，就要安装loader
			{
				test: /\.scss$/,
				use:
					ExtractTextPlugin.extract({
						fallback: 'style-loader',
						//css专有的压缩方式  当是build环境的时候进行压缩
						use: [
							{loader: 'css-loader', options: {minimize: env === 'build'}},
							{loader: 'sass-loader', options: 
									{outputStyle: env === 'build' ? "compressed" : "expended" }}

							]
					})
			},

			//加载css
			{
				test: /\.css$/,
				use: [
					{loader : 'style-loader'},
                    {loader: 'css-loader', options: {minimize: env === 'build'}}
				]
			},
            // 加载图片  需要引入到js中使用
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 100,
                    name: 'media/images/[name].[hash:7].[ext]'
                }
            },

            // 加载媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/mp4/[name].[hash:7].[ext]'
                }
            },

            // 加载iconfont
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/iconfont/[name].[hash:7].[ext]'
                }
            }
		]
	},

	// 配置插件
	// 数组中可以放任何的元素
	plugins: [
		//生成抽离文本插件的实例
		//根据不同的css生成不同的文件  name就是chunks名字 会带着scripts  需要修正名字

		new ExtractTextPlugin({
			filename:(getPath)=>{
				return env === "dev" ? getPath('[name].css').replace('scripts','styles') :
								       getPath('[name]@[chunkhash:6].css').replace('scripts','styles')
			},
			//开启多窗口
			allChunks: true
		}),
		//编译html的插件实例  index.html
		//不用在html中引用script和css 直接生成
		//模版。准备把谁当做模版 template:源文件  filename:生成的文件名
		//文件名：目标文件名
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			chunks:['scripts/app']
		}),

		//search.html  另一个chunk
		new HtmlWebpackPlugin({
				template: './src/search.html',
				filename: 'search.html',
				chunks:['scripts/search']
		})
	]
}

//根据不同环境，做不同的操作。
//开启服务器的时候，不能压缩js文件
if(env === 'dev') {
	//devServer固定的名字，不要瞎写
	//这个命令和webpack-dev-server是两个命令，需要打包之后再执行webpack-dev-server
    webPackSettings.devServer = {
        host: 'localhost',
        port: 4000,
        contentBase: __dirname + '/dev',
        noInfo:true,
        proxy: {
            '/vip': {
                target: 'www.baidu.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/vip': ''
                }
            }
        }
    }
}else {
    //代码的压缩 不需要装任何插件，天生的
    webPackSettings.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings:false
            },
            output: {
                comments:false
            }
        }));
}

//把接口暴露出去
module.exports = webPackSettings
