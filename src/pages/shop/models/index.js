import { message } from "antd";
import pathToRegexp from "path-to-regexp";
import { locationParams, localeMessage } from "@/utils";

//service
import { fetchList, setEnabled, remove } from "@/services/shop";
import router from "umi/router";

let isInit;
let isInitWorld;
export default {
	namespace: "shop",
	state: {
		name_space: "shop",
		list: [],

		pagination: {
			current: 1,
			pageSize: 10,
			total: 0
		},

		treeList: [],
		worldList: []
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname }) => {
				if (pathToRegexp("/shop/list").exec(pathname)) {
					// dispatch({ type: "queryList" });
				}
			});
		}
	},

	effects: {
		//列表
		*queryList({ payload }, { call, put }) {
			const params = locationParams();
			if (params.treeWithButton) {
				const treeobj = JSON.parse(params.treeWithButton);
				params.salesScopeRegionIds = treeobj.list;
				params.isSalesScopeOverseas = treeobj.isSalesScopeOverseas;
			}
			delete params.treeWithButton;
			payload = {
				page: 1,
				pageSize: 10,
				isEnabled: 1,
				...params
			};

			const { code, rows, total, errMsg } = yield call(
				fetchList,
				payload
			);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}
			yield put({
				type: "changeState",
				payload: {
					list: rows || [],
					pagination: {
						current: Number(payload.page || 1),
						pageSize: Number(payload.pageSize || 10),
						total
					}
				}
			});
		},
		//列表业内查询
		*queryListP({ payload }, { call, put }) {
			console.log(payload);
			const { code, rows, total, errMsg } = yield call(
				fetchList,
				payload
			);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}
			yield put({
				type: "changeState",
				payload: {
					list: rows || [],
					pagination: {
						current: Number(payload.page || 1),
						pageSize: Number(payload.pageSize || 10),
						total
					}
				}
			});
		},

		*setEnabled({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(setEnabled, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}
			message.success(localeMessage("common.operate.ok"));
			yield put({ type: "queryList" });
		},

		*remove({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(remove, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}

			message.success(localeMessage("common.operate.ok"));
			yield put({ type: "resetPage" });
		},
		*resetPage({ payload }, { put, select }) {
			const params = locationParams();
			const { pagination, list } = yield select(state => state.shop);
			let { current } = pagination;
			if (list.length === 1) {
				router.replace({
					pathname: "/shop/list",
					query: { ...params, page: current - 1 || 1 }
				});
			} else {
				yield put({
					type: "queryList"
				});
			}
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
