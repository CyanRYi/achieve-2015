var path = require('path');

module.exports = {
    entry: './App.js',
    cache: true,
    debug: true,
    output: {
        path: './resources/static/js',
        filename: './index.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: '/(node_modules)/',
                loader: 'babel-loader',
                query: {
                	presets: ['es2015', 'react'],
            		compact: false
                }
            },{
            	test: /\.css$/,
            	loader: "style-loader!css-loader"
            },{
            	test: /\.less$/,
            	loader: "style-loader!css-loader!less-loader"
            },{
            	test: /\.gif$/,
            	loader: "url-loader?mimetype=image/png"
            },{
            	test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
            	loader: "url-loader?mimetype=application/font-woff"
            },{
            	test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
            	loader: "file-loader?name=[name].[ext]"
            }
        ]
    }
};
