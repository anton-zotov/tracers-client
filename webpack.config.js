module.exports = {
    entry: './src/init.js',
    output: {
        filename: './dist/bundle.js'
    },
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	resolve: {
        extensions: ['.js', '.json']
    }
};
