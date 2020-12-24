import router from "umi/router";
import { message } from "antd";
import { stringify } from "qs";
import { setAuthority } from "@/utils/authority";
import { locationParams } from "@/utils";
//services
import {
	fakeLogin,
	fakeLogout,
	isLoginedAfterAuthorized
} from "@/services/user/login";

export default {
	namespace: "login",

	state: {
		isLogin: false
	},

	effects: {
		*login({ payload }, { call, put }) {
			yield call(fakeLogin, payload);
			router.push({
				pathname: "/shop/list"
			});
		},
		//登出按钮
		*logoutBtn(action, { put, call }) {
			// yield call(fakeLogout);
			yield put({
				type: "changeState",
				payload: {
					isLogin: false
				}
			});
			setAuthority();
			router.push({
				pathname: "/user/login"
			});
		},

		*logout(action, { put }) {
			yield put({
				type: "changeState",
				payload: {
					isLogin: false
				}
			});
			setAuthority();
			let query = {};
			if (
				window.location.hash != "#/" &&
				window.location.hash != "#/user/login"
			) {
				const params = locationParams();
				query = {
					redirect: params.redirect || window.location.href
				};
			}
			router.push({
				pathname: "/user/login",
				query
			});
		},
		//第一次登陆调用接口
		*isLoginedAfterAuthorized({ payload }, { call }) {
			yield call(isLoginedAfterAuthorized, payload);
		}
	},

	reducers: {
		changeState(state, { payload }) {
			return {
				...state,
				...payload
			};
		}
	}
};
