import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';

//service
import {
	detail,
} from '@/services/sys/orgCustomer';

import { fakeRegion, queryContryList } from '@/services/app';

let isInit, isInitWorld;
export default {
	namespace: 'orgCustomerDetail',
	state: {
		name_space: 'orgCustomerDetail',
		detail: {},

		provinceData: null,
		saleRegionIdList: [],

		regionData: [],
		worldList: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {
				if (pathToRegexp('/company/orgCustomer/detail').exec(pathname)) {
					dispatch({
						type: 'changeState',
						payload: {
							detail: {},

							provinceData: null,
							saleRegionIdList: [],
						}
					});

					dispatch({ type: 'queryRegion' });
					dispatch({ type: 'queryWorldOptions' });
					dispatch({ type: 'detail', payload: query.id });
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
			yield put({
				type: 'changeState',
				payload: {
					regionData: data,
				}
			});
		},

		*detail({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(detail, payload);
			if (code !== 0) return message.error(errMsg);

			yield put({
				type: 'changeState',
				payload: {
					detail: data,
					orgCustomerCode: data.code,
					saleRegionIdList: data.salesScopeRegionIds ? data.salesScopeRegionIds.split(',').map(id => Number(id)) : []
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
