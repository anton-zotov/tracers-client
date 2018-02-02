module.exports = {
	target: 'web',
	entry: ['babel-polyfill', './src/init.js'],
    output: {
        filename: './dist/bundle.js'
    },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['babel-loader', 'eslint-loader']
			}
		]
	},
	resolve: {
        extensions: ['.js', '.json']
    }
};
