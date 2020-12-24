import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { arrayToTree, locationParams, localeMessage } from '@/utils';

//service
import {
	detail,
	add,
	edit,
	generateCode,
	isCodeExisted,
} from '@/services/sys/orgCustomer';
import { fakeRegion, queryContryList } from '@/services/app';
import router from 'umi/router';

let isInit;
let isInitWorld;
export default {
	namespace: 'orgCustomerEdit',
	state: {
		name_space: 'orgCustomerEdit',

		detail: {},

		regionData: [],
		regionList: [],
		treeList: [],

		orgCustomerCode: '',

		saleRegionIdList: [],
		provinceData: null,

		isAbroad: false,

		worldList: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {
				if (pathToRegexp('/company/orgCustomer/create').exec(pathname) || pathToRegexp('/company/orgCustomer/edit').exec(pathname)) {
					dispatch({
						type: 'changeState',
						payload: {
							detail: {},
							orgCustomerCode: '',
							saleRegionIdList: [],
							provinceData: null,
						}
					});
					dispatch({ type: 'queryRegion' });
					dispatch({ type: 'queryWorldOptions' });

					if (pathToRegexp('/company/orgCustomer/create').exec(pathname)) {
						dispatch({ type: 'getCustomerCode' });
					} else {
						dispatch({ type: 'detail', payload: query.id });
					}
				}
			});
		},
	},

	effects: {
		*queryWorldOptions({ payload }, { call, put }) {
			if (isInitWorld) return;
			const { code, data, errMsg } = yield call(queryContryList, payload);
			if (code !== 0) return message.error(errMsg);

			isInitWorld = true;
			yield put({
				type: 'changeState',
				payload: {
					worldList: data.filter(obj => obj.enName)
				}
			});
		},

		*queryRegion({ payload }, { call, put }) {
			if (isInit) return;

			const { code, data, errMsg } = yield call(fakeRegion, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}

			// 只加载一次
			isInit = true;
			const treeList = data.filter(obj => obj.pid === 156).map(obj => ({
				title: obj.name,
				value: obj.id,
				key: obj.id,
				children: data.filter(child => child.pid === obj.id).map(child => ({
					title: child.name,
					value: child.id,
					key: child.id,
				}))
			}));

			const list = arrayToTree(data, 156, 'pid', 'id');
			yield put({
				type: 'changeState',
				payload: {
					regionData: data,
					regionList: list,
					treeList
				}
			});
		},

		*getCustomerCode({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(generateCode, payload);
			if (code !== 0) return message.error(errMsg);

			yield put({
				type: 'changeState',
				payload: {
					orgCustomerCode: data,
				}
			});
		},

		*isExisted({ payload, callback }, { call, put }) {
			const { code, data, errMsg } = yield call(isCodeExisted, payload);
			if (code !== 0) return message.error(errMsg);

			callback && callback(data);
		},

		*add({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(add, payload);
			if (code !== 0) return message.error(errMsg);

			message.success(localeMessage('common.operate.ok'));
			router.goBack();
		},

		*edit({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(edit, payload);
			if (code !== 0) return message.error(errMsg);

			message.success(localeMessage('common.operate.ok'));
			router.goBack();
		},

		*detail({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(detail, payload);
			if (code !== 0) return message.error(errMsg);

			yield put({
				type: 'changeState',
				payload: {
					detail: data,
					orgCustomerCode: data.code,
					saleRegionIdList: data.salesScopeRegionIds ? data.salesScopeRegionIds.split(',').map(id => Number(id)) : [],
					isAbroad: data.salesScopeOverseas
				}
			});
		},
	},

	reducers: {
		changeState(state, { payload = {} }) {
			return {
				...state,
				...payload,
			};
		}
	}

};
