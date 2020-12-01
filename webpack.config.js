module.exports = {
	mode: 'development',
	entry: {
		main: ''
	},
	output: {
		filename: ''
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: 'ts-loader'
			},
			{
				test: /\.(vs|fs|glsl)$/,
				exclude: /node_modules/,
				use: [
					'raw-loader',
					{
						loader: 'glslify-loader',
						options: {
							transform: [
								[ 'glslify-hex' ],
								[ 'glslify-import' ]
							],
							basedir: './src/glsl-chunks'
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true
						}
					},
					'postcss-loader',
					'sass-loader',
					{
						loader: 'sass-resources-loader',
						options: {
							resources: [
								'./src/views/style/resources/vars.scss',
								'./src/views/style/resources/mixins.scss',
							]
						},
					},
				],
			}
		]
	},
	resolve: {
		extensions: [ ".ts", ".tsx", ".js", ".json" ]
	},
};
