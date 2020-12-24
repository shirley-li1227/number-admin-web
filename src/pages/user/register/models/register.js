import router from 'umi/router';
import { message } from 'antd';
import {
	sendCheckCodeForRegister,
	checkMobileForRegister,
	createUserForRegister,
	isMobileBound,
	getAgreement
} from '@/services/user/register';
import { getCaptcha } from '@/services/app';
import { localeMessage } from '@/utils';

export default {
	namespace: 'register',

	state: {
		status: undefined,
		current: 0,
		captcha: '',
		tokenId: '',
		firstForm: {},
		secondForm: {},
		thirdForm: {},
		username: '',
		title: '',
		agreement: ''
	},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/user/login') {
					dispatch({
						type: 'changeState',
						payload: {
							current: 0,
							firstForm: {
								// remember:true//调试用
							},
							secondForm: {
								// idNumber: "123123123123232",
								// realName: "丽丽"
							},
							thirdForm: {},
						},
					});
				} else if(location.pathname === '/user/register') {
					dispatch({
						type: 'agreement',
					});
				}
			});
		},
	},
	effects: {
		* agreement ({ payload, callback }, { call, put }) {
			const {code, data } = yield call(getAgreement, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						title: data.title,
						agreement: data.agreement
					},
				});
			}
		},
		//验证手机号是否已经被注册
		* isMobileBound({ payload, callback }, { call, put }) {
			const { data } = yield call(isMobileBound, payload);
			callback&&callback(data);
		},
		//验证图形码
		* sendCheckCodeForRegister({ payload, callback }, { call, put }) {
			const { code, data, errMsg } = yield call(sendCheckCodeForRegister, payload);
			if (code === 0) {
				message.success(localeMessage('common.send.ok'));
				yield put({
					type: 'changeState',
					payload: {
						tokenId: data,
					},
				});
				callback && callback();
				return;
			} else if (code === 601) {
				yield put({
					type: 'getCaptcha',
				});
			}
			message.error(errMsg);
		},
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
		//验证手机号
		* checkMobileForRegister({ payload }, { call, put, select }) {
			const { tokenId } = yield select(state => state.register);
			const params = {
				...payload,
				tokenId: tokenId,
			};
			const { code, data, errMsg } = yield call(checkMobileForRegister, params);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						tokenId: data,
						current: 1,
						firstForm: params,
					},
				});
			} else {
				message.error(errMsg);
			}
		},
		//上一步
		* goPrev({ payload }, { put, select }) {
			console.log(payload);
			const { current } = yield select(state => state.register);
			yield put({
				type: 'changeState',
				payload: {
					current: current - 1,
					...payload,
				},
			});
		},
		//下一步按钮状态
		* changeBtnState(action, { put, select }) {
			const { firstForm } = yield select(state => state.register);
			firstForm.remember = !firstForm.remember;
			yield put({
				type: 'changeState',
				payload: {
					firstForm: firstForm,
				},
			});
		},
		//填写申请人信息下一步
		* saveFormData({ payload }, { put }) {
			yield put({
				type: 'changeState',
				payload: {
					secondForm: { ...payload },
					current: 2,
				},
			});
		},
		//填写账号信息提交
		* createUserForRegister({ payload }, { call, put, select }) {
			const { secondForm, firstForm, tokenId } = yield select(state => state.register);
			const params = {
				...secondForm,
				...payload,
				checkCode: firstForm.checkCode,
				imageCheckCode: firstForm.imageCheckCode,
				mobile: firstForm.cellphone,
				mobileCheckCode: firstForm.checkCode,
				mobileTokenId: tokenId,
				passwordConfirmed: payload.repassword,
			};
			console.log(params);
			const { code, errMsg } = yield call(createUserForRegister, params);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						current: 3,
						username: payload.username,
					},
				});
			} else {
				message.error(errMsg);
			}
		},
		* goLogin(action, { put }) {
			router.replace({
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
