const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //打包html的插件
const {CleanWebpackPlugin} = require("clean-webpack-plugin");//清理 /dist 文件夹,只会生成用到的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//css各文件分离，生成的文件 不嵌入bundle.js，而是放在单独的文件里
module.exports = {
    mode: "production",//压缩输出(删除“未使用代码(dead code)”)
    // devtool: 'inline-source-map',//source map 功能,将编译后的代码映射回原始源代码。就是告诉你哪个文件哪行代码出错
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        // publicPath:"./",
    },

    devServer: {//它允许在运行时更新各种模块，而无需进行完全刷新。
        hot: true,
        contentBase: './build',//在 port 下建立服务，将 build 目录下的文件，作为可访问文件。
        inline: true, //实时刷新
        port: '8090'
    },
    module: {
        rules: [
            {//匹配所有以js或者jsx结尾的文件，并用 babel-preset-env和babel-preset-react进行解析
                test: /\.js$/,
                use: [
                    {loader: "eslint-loader"},
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [["env"], ["react"]]
                        }
                    }
                ],
            },

            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {//名字前面加哈希值，最长32位。这里是5位。
                            name: "[name]-[hash:5].min.[ext]",
                            limit: 20000, // 20000 <= 20KB //如果图片大小小于limit则以base64的格式加载，否则以图片地址方式加载
                            publicPath: "./image",//很重要的属性,会根据这个来获取图片路径 ./image与../image的区别
                            outputPath: "image/"
                        }
                    }
                ]
            },
            {//用来处理html src 图片无法引入的问题
                test: /\.html$/,
                loader: 'html-withimg-loader'
            }
        ]
    },
    //插件
    optimization: {
        splitChunks: {//代码分离
            cacheGroups: {
                commons: {
                    //test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|axios|antd-mobile)[\\/]/,
                    test: /[\\/]node_modules[\\/]/,//用于控制哪些模块被这个缓存组匹配到。原封不动传递出去的话，它默认会选择所有的模块。
                    name: 'vendors',//(打包的chunks的名字)
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        // new webpack.NamedModulesPlugin(),//它允许在运行时更新各种模块，而无需进行完全刷新。
        new webpack.HotModuleReplacementPlugin(),//它允许在运行时更新各种模块，而无需进行完全刷新。
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({//为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
            template: './src/index.html',　　//为新生成的index.html指定模版
            minify: { //压缩HTML文件
                removeComments: true,    //移除HTML中的注释
                collapseWhitespace: true    //删除空白符与换行符
            },
            hash: true, //如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用。
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "[id].[contenthash:8].css"
        })
    ]
};