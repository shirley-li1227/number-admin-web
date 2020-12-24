import { message } from 'antd';
import {
	getMyAccount,
	updateMyAccount,
	sendCheckCode,
	checkMobileCheckCode,
	changeMobile,
	sendEmailCheckCode,
	checkEmailCheckCode,
	changeMobileByEmail,
	changeEmailByMobile,
	bindEmail,
} from '@/services/user/profile';
import { localeMessage } from '@/utils';

export default {
	namespace: 'profile',
	state: {
		userInfo: {},
		ProfileModalVisible: false,
		changeMobileModalVisible: false,
		changeEmailModalVisible: false,
		bindEmailModalVisible: false,
		changeMobileData: {
			newTokenId: '',
			newMobile: '',
			newCheckCode: '',
			oldTokenId: '',
			oldCheckCode: '',
			emailCheckCode: '',
			emailTokenId: '',
		},
		changeEmailData: {
			email: '',
			emailCheckCode: '',
			mobileTokenId: '',
			mobileCheckCode: '',
			emailTokenId: '',
			mobile: '',
		},
		checkMobileState: '1',	//验证手机号1；验证邮箱2；绑定新手机号3；
		checkEmailState: '1',	//验证手机号1；绑定新邮箱2；
		bindEmailTokenId: '',
	},
	subscriptions: {},
	effects: {
		//获取个人资料详情
		* getMyAccount({ payload }, { call, put }) {
			const { code, data, errMsg } = yield call(getMyAccount, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						userInfo: data,
					},
				});
				return;
			}
			message.error(errMsg);
		},
		//修改个人资料
		* updateMyAccount({ payload }, { call, put }) {
			const { code, errMsg } = yield call(updateMyAccount, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						ProfileModalVisible: false,
					},
				});
				yield put({ type: 'app/fetchUser' });
				message.success(localeMessage('common.edit.ok'));
				return;
			}
			message.error(errMsg);
		},
		* changeParams({ payload }, { put }) {
			yield put({
				type: 'changeState',
				payload: {
					...payload,
				},
			});
		},
		//发送短信验证码
		* sendCheckCode({ payload, callback }, { call, put, select }) {
			const { code, data, errMsg } = yield call(sendCheckCode, payload);
			const { changeMobileData, changeEmailData } = yield select(state => state.profile);
			if (code === 0) {
				message.success(localeMessage('common.update.ok'));
				//修改绑定邮箱时
				if (payload.checkEmailState === '1') {
					changeEmailData.mobileTokenId = data;
					yield put({
						type: 'changeState',
						payload: {
							changeEmailData: changeEmailData,
						},
					});
				} else {
					//修改绑定手机时
					if (payload.checkMobileState === '1') {
						changeMobileData.oldTokenId = data;
					} else {
						changeMobileData.newMobile = payload.cellphone;
						changeMobileData.newTokenId = data;
					}
					yield put({
						type: 'changeState',
						payload: {
							changeMobileData: changeMobileData,
						},
					});
				}
				callback && callback();
				return;
			}
			message.error(errMsg);
		},
		//验证手机验证码
		* checkMobileCheckCode({ payload, callback }, { call, put, select }) {
			const { changeMobileData, changeEmailData } = yield select(state => state.profile);
			let params = {};
			if (payload.isChangeEmail) {//修改邮箱
				params = {
					tokenId: changeEmailData.mobileTokenId,
					...payload,
				};
			} else {//修改手机
				params = {
					tokenId: changeMobileData.oldTokenId,
					...payload,
				};
			}
			const { code, errMsg } = yield call(checkMobileCheckCode, params);
			if (code === 0) {
				//修改邮箱
				if (payload.isChangeEmail) {
					changeEmailData.mobileCheckCode = payload.checkCode;
					yield put({
						type: 'changeState',
						payload: {
							changeEmailData: changeEmailData,
							checkEmailState: '2',
						},
					});
				} else {//修改手机
					changeMobileData.oldCheckCode = payload.checkCode;
					yield put({
						type: 'changeState',
						payload: {
							changeMobileData: changeMobileData,
							checkMobileState: '3',
						},
					});
				}
				callback && callback();
				return;
			}
			message.error(errMsg);
		},
		* changeMobile({ payload }, { call, put, select }) {
			const { changeMobileData } = yield select(state => state.profile);
			changeMobileData.newCheckCode = payload.checkCode;
			console.log(changeMobileData);
			const { code, errMsg } = yield call(changeMobile, changeMobileData);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						changeMobileModalVisible: false,
						ProfileModalVisible: false,
					},
				});
				message.success(localeMessage('common.edit.ok'));
				return;
			}
			message.error(errMsg);
		},
		* sendEmailCheckCode({ payload, callback }, { call, put, select }) {
			const { code, data, errMsg } = yield call(sendEmailCheckCode, payload);
			const { changeMobileData, changeEmailData } = yield select(state => state.profile);
			if (code === 0) {
				message.success(localeMessage('common.send.ok'));
				if (payload.isChangeEmail) {
					changeEmailData.emailTokenId = data;
					yield put({
						type: 'changeState',
						payload: {
							changeEmailData: changeEmailData,
						},
					});
				} else {
					changeMobileData.emailTokenId = data;
					yield put({
						type: 'changeState',
						payload: {
							changeMobileData: changeMobileData,
						},
					});
				}
				callback && callback();
				return;
			}
			message.error(errMsg);
		},
		* checkEmailCheckCode({ payload, callback }, { call, put, select }) {
			const { changeMobileData, userInfo } = yield select(state => state.profile);
			const params = {
				emailTokenId: changeMobileData.emailTokenId,
				email: userInfo.email,
				...payload,
			};
			const { code, errMsg } = yield call(checkEmailCheckCode, params);
			if (code === 0) {
				changeMobileData.emailCheckCode = payload.emailCheckCode;
				yield put({
					type: 'changeState',
					payload: {
						changeMobileData: changeMobileData,
						checkMobileState: '3',
					},
				});
				callback && callback();
				return;
			}
			message.error(errMsg);
		},
		* changeMobileByEmail({ payload }, { call, put, select }) {
			const { changeMobileData } = yield select(state => state.profile);
			changeMobileData.newCheckCode = payload.checkCode;
			console.log(changeMobileData);
			const { code, errMsg } = yield call(changeMobileByEmail, changeMobileData);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						changeMobileModalVisible: false,
						ProfileModalVisible: false,
					},
				});
				message.success(localeMessage('common.edit.ok'));
				return;
			}
			message.error(errMsg);
		},
		* changeEmailByMobile({ payload }, { call, put, select }) {
			const { changeEmailData, userInfo } = yield select(state => state.profile);
			changeEmailData.emailCheckCode = payload.emailCheckCode;
			changeEmailData.email = payload.email;
			changeEmailData.mobile = userInfo.mobile;
			console.log(changeEmailData);
			const { code, errMsg } = yield call(changeEmailByMobile, changeEmailData);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						changeEmailModalVisible: false,
						ProfileModalVisible: false,
					},
				});
				message.success(localeMessage('common.edit.ok'));
				return;
			}
			message.error(errMsg);
		},
		//绑定邮箱发送验证码
		* sendBindEmailCheckCode({ payload, callback }, { call, put }) {
			const { code, data, errMsg } = yield call(sendEmailCheckCode, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						bindEmailTokenId: data,
					},
				});
				message.success(localeMessage('common.send.ok'));
				callback && callback();
				return;
			}
			message.error(errMsg);
		},
		//绑定邮箱
		* bindEmail({ payload }, { call, put, select }) {
			const { bindEmailTokenId } = yield select(state => state.profile);
			const params = { tokenId: bindEmailTokenId, ...payload };
			const { code, errMsg } = yield call(bindEmail, params);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						bindEmailModalVisible: false,
						ProfileModalVisible: false,
					},
				});
				message.success(localeMessage('common.bind.ok'));
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
