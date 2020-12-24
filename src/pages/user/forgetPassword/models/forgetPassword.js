import router from 'umi/router';
import { message } from 'antd';
import {
	getUserCheckInfo,
	emailCaptcha,
	mobileCaptcha,
	checkMobileCheckCode,
	checkEmailCheckCode,
	changePwd,
} from '@/services/user/forgetPassword';
import { getCaptcha } from '@/services/app';
import { localeMessage } from '@/utils';

export default {
	namespace: 'forgetPassword',

	state: {
		status: undefined,
		current: 0,
		captcha: '',
		userInfo: '',
		tokenId: '',
		isMobileChecked: '',
		checkCode: '',
	},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/user/login') {
					dispatch({
						type: 'changeState',
						payload: {
							current: 0,
						},
					});
				}
			});
		},
	},
	effects: {
		* getCaptcha({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(getCaptcha, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						captcha: data,
					},
				});
			} else {
				message.error(errMsg);
			}
		},
		* userCheck({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(getUserCheckInfo, payload);
			if (code === 0) {
				console.log(data);
				yield put({
					type: 'changeState',
					payload: {
						current: 1,
						userInfo: data,
					},
				});
			} else {
				yield put({
					type: 'getCaptcha',
				});
				message.error(errMsg);
			}
		},
		* verificationIdentity({ payload }, { call, put, select }) {
			const { tokenId, userInfo, isMobileChecked } = yield select(state => state.forgetPassword);
			const params = {
				tokenId: tokenId,
				username: userInfo.username,
				...payload,
			};
			console.log(params);
			const fn = isMobileChecked ? checkMobileCheckCode : checkEmailCheckCode;
			const { code, errMsg } = yield call(fn, params);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						current: 2,
						checkCode: payload.checkCode,
					},
				});
			} else {
				message.error(errMsg);
			}
		},
		//获取手机验证码
		* getMobileCaptcha({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(mobileCaptcha, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						tokenId: data,
						isMobileChecked: true,
					},
				});
				message.success(localeMessage('common.send.ok'));
			} else {
				message.error(errMsg);
			}

		},
		//获取邮箱验证码
		* getEmailCaptcha({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(emailCaptcha, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						tokenId: data,
						isMobileChecked: false,
					},
				});
				message.success(localeMessage('common.send.ok'));
			} else {
				message.error(errMsg);
			}
		},
		//设置新密码
		* changePwd({ payload }, { call, put, select }) {
			const { newPassword, rePassword } = payload;
			if (newPassword.length < 6 || newPassword.length > 20) {
				message.error(localeMessage('common.model.password.validator', { min: 6, max: 20 }));
				return;
			}
			if (newPassword.indexOf(' ') > -1) {
				message.error(localeMessage('common.model.password.required'));
				return;
			}
			if (rePassword != newPassword) {
				message.error(localeMessage('common.model.password.notsame'));
				return;
			}
			const { tokenId, userInfo, isMobileChecked, checkCode } = yield select(state => state.forgetPassword);
			const params = {
				tokenId: tokenId,
				username: userInfo.username,
				checkType: isMobileChecked ? 'mobile' : 'email',
				checkCode: checkCode,
				...payload,
			};
			const { code, errMsg } = yield call(changePwd, params);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						current: 3,
					},
				});
			} else {
				message.error(errMsg);
			}
		},
		* goLogin(action, { put }) {
			router.push({
				pathname: '/user/login',
			});
			yield put({
				type: 'changeState',
				payload: {
					current: 0,
				},
			});
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
