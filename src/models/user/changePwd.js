import { message } from 'antd';
import router from 'umi/router';
import {
	changePasswordByMobile,
	sendCheckCode,
	getMyAccount,
	changePassword,
} from '@/services/user/changePwd';
import { localeMessage } from '@/utils';

export default {
	namespace: 'changePwd',
	state: {
		changePwdModalVisible: false,
		userInfo: {},
		mobileTokenId: '',
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
		* sendCheckCode({ payload, callback }, { call, put }) {
			const { code, data, errMsg } = yield call(sendCheckCode, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						mobileTokenId: data,
					},
				});
				message.success(localeMessage('common.send.other'));
				callback && callback();
				return;
			}
			message.error(errMsg);
		},
		* changePasswordByMobile({ payload }, { call, put, select }) {
			const { mobileTokenId } = yield select(state => state.changePwd);
			const params = {
				...payload,
				mobileTokenId,
			};
			const { code, errMsg } = yield call(changePasswordByMobile, params);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						changePwdModalVisible: false,
					},
				});
				message.success(localeMessage('common.model.changePwd.tip'));
				router.push({
					pathname: '/user/login',
				});
				return;
			}
			message.error(errMsg);
		},
		* changePassword({ payload }, { call, put }) {
			const { code, errMsg } = yield call(changePassword, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						changePwdModalVisible: false,
					},
				});
				message.success(localeMessage('common.model.changePwd.tip'));
				router.push({
					pathname: '/user/login',
				});
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
