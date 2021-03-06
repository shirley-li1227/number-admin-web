import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';

//service
import {
	downloadCsv,
	importCsv,
	getCsvImportRecord
} from '@/services/sys/product';
import { fakeRegion } from '@/services/app';
import router from 'umi/router';

let isInit;
export default {
	namespace: 'productImport',
	state: {
		name_space: 'productImport',
		importResult: {},
		code: '',
		errMsg: '',
		recordlist: [],
		importType: 111
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {
				if (pathToRegexp('/product/product/import').exec(pathname)) {
					dispatch({ type: 'downloadCsv', payload: query.id });
				}
			});
		},
	},

	effects: {
		*downloadCsv({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(downloadCsv, payload);
			if (code !== 0) return message.error(errMsg);
			console.log(data);
		},
		*getCsvImportRecord({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(getCsvImportRecord, payload);
			if (code !== 0) return message.error(errMsg);
			console.log(1111, data);
			yield put({
				type: 'changeState',
				payload: {
					importResult: {},
					code: code,
					errMsg: errMsg,
					recordlist: data
				}
			});
		},
		*clearAll({ payload }, { call, put }) {
			yield put({
				type: 'changeState',
				payload: {
					importResult: {},
					code: '',
					errMsg: '',
					recordlist: [],
					importType: 111
				}
			});
		},
		*importCsv({ payload }, { call, put }) {
			yield put({
				type: 'changeState',
				payload: {
					importType: 222,
				}
			});
			const { code, data, errMsg } = yield call(importCsv, payload);
			if (code === 500) message.error(errMsg);
			console.log(data);
			yield put({
				type: 'changeState',
				payload: {
					importResult: data,
					code: code,
					errMsg: errMsg,
					recordlist: []
				}
			});
			yield put({
				type: 'changeState',
				payload: {
					importType: 111,
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
