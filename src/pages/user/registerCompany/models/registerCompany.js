import router from 'umi/router';
import pathToRegexp from 'path-to-regexp';
import { arrayToTree, locationParams, localeMessage } from '@/utils';
import { message } from 'antd';
import {
	getFirstCategoryList,
	companyRegister,
	getCompanyRegistrationInfo,
	checkUsccIsExisted,
} from '@/services/user/registerCompany';
import { fakeRegion } from '@/services/app';

export default {
	namespace: 'registerCompany',
	state: {
		detailStatus: 0,
		regionList: [],
		brandCategoryList: [],
		companyInfo: {
			// address:{
			// 	address:'asdasda',
			// 	region:[110000,110100,110101],
			// },
			// addressInfo: "asdasd",
			// areaCode: 1231,
			// brandCategoryIds: "87,48",
			// brandEnglishName: "asefdsdfsdf",
			// brandLogoUrl: "https://test-1255382539.picsh.myqcloud.com/sys/brand/logo/2018/12/2018-12-18/3541ea6b-ac11-422c-9b8b-3218604cce57.jpg",
			// brandName: "的的撒发生发",
			// businessTerm: "2018-12-18 至 2018-12-31",
			// certificateUrl0: "https://test-1255382539.picsh.myqcloud.com/sys/brand/certificate/2018/12/2018-12-18/f4957132-d2e4-43c3-b76a-5c8cc4d02503.jpg",
			// certificateUrls: ["https://test-1255382539.picsh.myqcloud.com/sys/bra…18-12-18/f4957132-d2e4-43c3-b76a-5c8cc4d02503.jpg"],
			// certificateValidDate: "2018-12-18",
			// cityId: 110100,
			// companyName: "tgdfgfdg",
			// contactPerson: "zxvcxvzxc",
			// contactPhone: "1231-12121212-211111",
			// districtId: 110101,
			// enabledAfterAudited: true,
			// enabledAfterAuditedStr: "是",
			// file: "",
			// fullAddress: "北京北京市东城区asdasd",
			// introduction: "sdfsdfsdfsd",
			// isEnabledAfterAudited: true,
			// licenseCopyUrl: "https://test-1255382539.picsh.myqcloud.com/sys/companyBusinessLicense/2018/12/2018-12-18/f846a9d9-5c40-437c-9417-e5e99c4cdab9.jpg",
			// longTerm: false,
			// operatingPeriodBeginDate: "2018-12-18",
			// operatingPeriodEndDate: "2018-12-31",
			// portal: "http://www.baidu.com",
			// provinceId: 110000,
			// runNumber: 211111,
			// telNumber: 12121212,
			// uscc: '211111111111111111',
		},
		current: 0,
	},
	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {
				if (pathToRegexp('/user/registerCompany').exec(pathname)) {
					dispatch({
						type: 'queryRegion',
					});
					dispatch({
						type: 'getFirstCategoryList',
					});
					if (query.current === 0 || query.current) {
						console.log('current' + query.current);
						dispatch({
							type: 'changeState',
							payload: {
								current: Number(query.current),
							},
						});
					} else {
						dispatch({
							type: 'changeState',
							payload: {
								current: 0,
							},
						});
					}
				}
				if (pathToRegexp('/user/registerCompany/detail').exec(pathname) || pathToRegexp('/company/registerCompanySuccess').exec(pathname)) {
					dispatch({
						type: 'getFirstCategoryList',
					});
					const registerCompanyInfo = JSON.parse(sessionStorage.getItem('registerCompanyInfo'));
					dispatch({
						type: 'changeState',
						payload: {
							detailStatus: Number(query.detailStatus),
						},
					});
					if (Number(query.detailStatus) === 0) {
						dispatch({
							type: 'changeState',
							payload: {
								companyInfo: registerCompanyInfo,
							},
						});
					}
				}
			});
		},
	},
	effects: {
		//获取详情数据
		* getCompanyRegistrationInfo({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(getCompanyRegistrationInfo, payload);
			console.log(data);
			const params = locationParams();
			console.log(params);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						companyInfo: data,
					},
				});
				if (Number(data.auditStatus) === 2 && !params.isLogin) {
					message.success(localeMessage('common.model.registerCompany.success'));
					router.replace({
						pathname: '/user/login',
					});
				} else if (!params.isLogin) {
					router.replace({
						pathname: '/user/registerCompany/detail',
						query: {
							detailStatus: data.auditStatus,
						},
					});
				}
				return;
			}
			message.error(errMsg);

		},
		//省市区下拉选项初始化
		* queryRegion({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(fakeRegion, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}
			const list = arrayToTree(data, 156, 'pid', 'id');
			yield put({
				type: 'changeState',
				payload: { regionList: list },
			});
		},
		//行业类目下拉选项
		* getFirstCategoryList({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(getFirstCategoryList, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}
			yield put({
				type: 'changeState',
				payload: { brandCategoryList: data },
			});

		},
		* firstStep({ payload }, { put }) {
			yield put({
				type: 'updateCompanyInfo',
				payload: {
					...payload,
				},
			});
			yield put({
				type: 'changeState',
				payload: {
					current: 1,
				},
			});
		},
		* updateCompanyInfo({ payload }, { put, select }) {
			const { companyInfo } = yield select(state => state.registerCompany);
			const info = {
				...companyInfo,
				...payload,
			};
			yield put({
				type: 'changeState',
				payload: {
					companyInfo: {
						...info,
					},
				},
			});
			sessionStorage.setItem('registerCompanyInfo', JSON.stringify(info));
			console.log(info);
		},
		* secondStep({ payload }, { put }) {
			yield put({
				type: 'updateCompanyInfo',
				payload: {
					...payload,
				},
			});
			yield put({
				type: 'changeState',
				payload: {
					current: 2,
				},
			});
		},
		* thirdStep({ payload }, { put }) {
			yield put({
				type: 'updateCompanyInfo',
				payload: {
					...payload,
				},
			});
			router.replace({
				pathname: '/user/registerCompany/detail',
				query: {
					detailStatus: 0,
				},
			});
		},
		* changeParams({ payload }, { }) {
			router.replace({
				pathname: '/user/registerCompany',
				query: {
					...payload,
				},
			});
		},
		//上一步
		* prevStep({ payload }, { put }) {
			yield put({
				type: 'changeState',
				payload: {
					...payload,
				},
			});
		},
		//提交
		* companyRegister(action, { call, put, select }) {
			const { companyInfo } = yield select(state => state.registerCompany);
			const { code, errMsg } = yield call(companyRegister, companyInfo);
			if (code === 0) {
				message.success(localeMessage('common.submit.ok'));
				yield put({
					type: 'changeState',
					payload: {
						detailStatus: 1,
					},
				});
				yield put({
					type: 'getCompanyRegistrationInfo',
					payload: {
						isAudit: true,
					},
				});
				return;
			}
			message.error(errMsg);
		},
		* checkUsccIsExisted({ payload }, { call }) {
			const { code, data, errMsg } = yield call(checkUsccIsExisted, payload);
			if (code === 0) {
				if (data) {
					message.error(localeMessage('common.model.registerCompany.usccIsExisted'));
				}
				return;
			}
			message.error(errMsg);
		},
	},

	reducers: {
		changeState(state, { payload }) {
			return {
				...state,
				...payload,
			};
		},
	},
};
