/*
 * @Description: umijs 配置文件
 * @Author: zhao
 * @Date: 2019-10-12 11:52:06
 * @LastEditors: ShirleyLi
 * @LastEditTime: 2020-02-19 15:12:00
 */

// ref: https://umijs.org/config/
import theme from '../src/theme';
import routes from './router.config';
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
export default {
	history: 'hash',
	hash: true, // 开启文件后缀
	base: './',
	publicPath: './', // 部署到当前目录下
	plugins: [
		// ref: https://umijs.org/plugin/umi-plugin-react.html
		['umi-plugin-react', {
			antd: true,
			dva: true,
			dynamicImport: {
				loadingComponent: './components/pageLoading',
			},
			dll: false,
			routes: {
				exclude: [],
			},
			hardSource: false,
			chunks: process.env.NODE_ENV === 'production' ? ['antdesigns', 'vendors', 'default.umi', 'umi'] : ['umi'],
			locale: {
				default: 'zh-CN', //默认语言 zh-CN
				baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
				antd: true // 是否启用antd的<LocaleProvider />
			},
		}],
	],

	routes: routes,
	extraBabelPlugins: [
		['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
	],
	targets: {
		ie: 9
	},
	// Theme for antd
	// https://ant.design/docs/react/customize-theme-cn
	theme: theme,

	ignoreMomentLocale: true,
	lessLoaderOptions: {
		javascriptEnabled: true,
	},
	disableRedirectHoist: true,

	// 打包参数 取消warn 和 console的输出
	uglifyJSOptions(opts) {
		opts.uglifyOptions.compress.warnings = true;
		opts.uglifyOptions.compress.drop_console = true;
		return opts;
	},

	chainWebpack(config) {
		config.when(process.env.NODE_ENV === 'production', config => {
			process.env.NODE_ENV === 'production' && config.merge({
				optimization: {
					minimize: true,
					splitChunks: {
						chunks: 'all',
						automaticNameDelimiter: '.',
						name: true,
						minSize: 30000,
						maxSize: 0,
						minChunks: 1,
						maxAsyncRequests: 10,
						maxInitialRequests: 5,
						cacheGroups: {
							vendors: {
								name: 'vendors',
								chunks: 'all',
								test: /[\\/]node_modules[\\/](react|react-dom|dva|moment)[\\/]/,
								priority: -10,
							},
							antdesigns: {
								name: 'antdesigns',
								chunks: 'all',
								test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
								priority: -11,
							},
							default: {
								minChunks: 1,
								priority: -20,
								reuseExistingChunk: true
							}
						}
					},
				},

			});
		});
	},
	define: {
		SERVICE_EVN: process.env.SERVICE_EVN || ''
	},

	proxy: {
		'/api/': {
			// target: 'http://127.0.0.1:8081/',
			// target: 'http://10.1.12.220:8705/api/',
			target: 'http://ehsure.315family.com:8805/api/',
			// target: 'https://org.zpws.ehsure.com/api/',
			// target: 'http://mars-sdna.ehsure.com/api/', //箭牌
			changeOrigin: true,
			// pathRewrite: { '^/server': '' },
		},
	},
};
