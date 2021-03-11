const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');



module.exports = {
    entry: {
        index : {
            import: './src/index.js',
            dependOn: 'shared',
            filename: '[name].js'
        },
        login : {
            import: './src/js/login/login.js',
            dependOn: 'shared',
            filename: './js/login/[name].js'
        },
        main : {
            import: './src/js/main/main.js',
            dependOn: 'shared',
            filename: './js/main/[name].js'
        },
        shared: 'lodash',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: (pathData) => {
            return pathData.chunk.name === 'main' ? '[name].js' : 'view/[name].js';
        }
    },
    mode : 'development',
    //mode : 'production',
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns : [
                {
                    from : 'src/*.html',
                    to : path.resolve(__dirname, 'dist/[name].html')
                },
                {
                    context : "src/css/",
                    from : '**/*',
                    to : 'css'
                },
                {
                    context : "src/resources",
                    from : '**/*',
                    to : 'resources'
                },
                {
                    context : "src/webfonts",
                    from : '**/*',
                    to : 'webfonts'
                }]
        }),
    ],
    module: {
        rules: [
            {
                test:/\.vue$/,
                use : [{
                    loader: "vue-loader",
                    options: {
                        modules: true,
                    }
                }],
                include: path.resolve(__dirname, 'src/view'),
            },
            {
                test:/\.vue$/,
                use : [{
                    loader: "vue-loader",
                    options: {
                        modules: true,
                    }
                }],
                include: path.resolve(__dirname, 'src/component'),
            },
            {
                test: /\.js$/,
                use : [{
                    loader: "babel-loader",
                    options: {

                    }
                }],
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // 开启 CSS Modules
                            modules: false,
                            esModule:false
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
        ]
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.min.js'
        }
    }
};