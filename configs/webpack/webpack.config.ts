import { Configuration } from 'webpack';
import {} from 'webpack-dev-server';
import DotenvPlugin from 'dotenv-webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { BuildEnv, BuildPaths } from './types';

export default (env: unknown, argv: BuildEnv): Configuration => {
	const paths: BuildPaths = {
		entry: path.resolve(__dirname, '../../src', 'index.tsx'),
		dist: path.resolve(__dirname, '../../dist'),
		src: path.resolve(__dirname, '../../src'),
		public: path.resolve(__dirname, '../../public'),
	};

	const MODE = argv.mode || 'development';
	const PORT = argv.port || 3000;
	const isDevelopment = MODE === 'development';

	const plugins = [
		new DotenvPlugin(),
		new HtmlWebPackPlugin({
			template: './public/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
			chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css',
		}),
	];

	return {
		resolve: {
			alias: {},
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			preferAbsolute: true,
			modules: [paths.src, 'node_modules'],
			mainFiles: ['index'],
		},
		entry: paths.entry,
		output: {
			publicPath: '/',
			path: paths.dist,
			filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
			chunkFilename: isDevelopment ? '[id].js' : '[id].[contenthash].js',
		},
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.module\.s?css$/,
					use: [
						isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								modules: {
									mode: 'local',
									localIdentName: isDevelopment
										? '[path][name]__[local]'
										: '[contenthash:base64]',
								},
							},
						},
						'postcss-loader',
						'sass-loader',
					],
				},
				{
					test: /\.s?css$/,
					exclude: [/\.module\.s?css$/],
					use: [
						isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader',
						'postcss-loader',
						'sass-loader',
					],
				},
				{
					test: /\.(png|jpg|svg)$/i,
					type: 'asset',
				},
				{
					test: /\.(woff|woff2)$/i,
					type: 'asset',
				},
			],
		},
		plugins,
		devServer: {
			port: PORT,
			host: '0.0.0.0',
			historyApiFallback: true,
			client: {
				overlay: {
					warnings: false,
					errors: true,
				},
				progress: true,
			},
			hot: true,
			// proxy: {},
		},
	};
};
