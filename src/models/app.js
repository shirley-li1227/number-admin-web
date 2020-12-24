import { message } from "antd";
import RouterMap from "@/const/routerMap";

//service
import {
	fakeMenu,
	queryAuthList,
	fakeUnReadMsgCount,
	fakeUserInfo
} from "@/services/app";

export default {
	namespace: "app",

	state: {
		collapsed: false,
		menuList: [],
		unReadMsgCount: 0,
		user: {},
		authList: [],
		selectKeys: ""
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// Subscribe history(url) change, trigger `load` action if pathname is `/`
			return history.listen(({ pathname, search }) => {
				if (typeof window.ga !== "undefined") {
					window.ga("send", "pageview", pathname + search);
				}
				dispatch({ type: "getSelectKeys", payload: { pathname } });
			});
		}
	},

	effects: {
		*fetchMenu({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(fakeMenu, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}

			const authResult = yield call(queryAuthList, payload);
			if (authResult.code !== 0) {
				message.error(authResult.errMsg);
				return;
			}

			let list = [];
			const pushCode = child => {
				list.push(child.code);
				if (child.children && child.children.length) {
					child.children.forEach(item => {
						pushCode(item);
					});
				}
			};
			data.forEach(menu => {
				pushCode(menu);
			});

			authResult.data &&
				authResult.data.forEach(auth => {
					list.push(`${auth.moduleCode}_${auth.code}`);
				});

			yield put({
				type: "changeState",
				payload: {
					menuList: data,
					authList: list
				}
			});
		},

		*fetchUnReadMsgCount({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(
				fakeUnReadMsgCount,
				payload
			);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}

			yield put({
				type: "changeState",
				payload: {
					unReadMsgCount: data
				}
			});
		},

		*fetchUser({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(fakeUserInfo, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}
			yield put({
				type: "changeState",
				payload: {
					user: data
				}
			});
			return;
		},
		*getSelectKeys({ payload }, { select, put }) {
			const { menuList } = yield select(({ app }) => app);
			let selectKeys = "";
			let path = payload.pathname;
			const getKey = child => {
				for (let i = 0; i < child.length; i++) {
					const item = child[i];
					const itemPath = RouterMap[item.path]
						? RouterMap[item.path]
						: item.path;
					if (path !== "/" && itemPath === path) {
						selectKeys = itemPath;
						break;
					}
					if (item.children.length > 0) {
						getKey(item.children);
					}
				}
			};
			if (menuList.length > 0) {
				menuList.forEach(item => {
					if (item.children.length > 0) {
						getKey(item.children);
					}
				});
				if (selectKeys) {
					yield put({ type: "changeState", payload: { selectKeys } });
				} else {
					let pathList = path.split("/");
					pathList = pathList.splice(1, pathList.length - 2);
					path = "/" + pathList.join("/");
					if (path !== "/") {
						yield put({
							type: "getSelectKeys",
							payload: { pathname: path }
						});
					}
				}
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
