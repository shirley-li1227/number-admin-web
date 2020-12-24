import { message } from "antd";
import pathToRegexp from "path-to-regexp";

//service
import {
	downloadCsv,
	importCsv,
	getCsvImportRecord
} from "@/services/sys/orgCustomer";
import { fakeRegion } from "@/services/app";
import router from "umi/router";

let isInit;
export default {
	namespace: "orgCustomerImport",
	state: {
		name_space: "orgCustomerImport",
		importResult: {},
		code: "",
		errMsg: "",
		recordlist: [],
		importType: 111
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {});
		}
	},

	effects: {
		*downloadCsv({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(downloadCsv, payload);
			if (code !== 0) return message.error(errMsg);
			console.log(data);
		},
		*getCsvImportRecord({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(
				getCsvImportRecord,
				payload
			);
			if (code !== 0) return message.error(errMsg);
			console.log(data);
			yield put({
				type: "changeState",
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
				type: "changeState",
				payload: {
					importResult: {},
					code: "",
					errMsg: "",
					recordlist: [],
					importType: 111
				}
			});
		},
		*importCsv({ payload }, { call, put }) {
			yield put({
				type: "changeState",
				payload: {
					importType: 222
				}
			});
			const { code, data, errMsg } = yield call(importCsv, payload);
			if (code === 500) message.error(errMsg);
			console.log(data);
			yield put({
				type: "changeState",
				payload: {
					importResult: data,
					code: code,
					errMsg: errMsg,
					recordlist: []
				}
			});
			yield put({
				type: "changeState",
				payload: {
					importType: 111
				}
			});
		}
	},

	reducers: {
		changeState(state, { payload = {} }) {
			return {
				...state,
				...payload
			};
		}
	}
};
