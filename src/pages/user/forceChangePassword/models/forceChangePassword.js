import { message } from 'antd';
import { locationParams, localeMessage } from '@/utils';
import router from 'umi/router';

//service
import {
	forceChangePassword,
} from '@/services/user/forceChangePassword';

export default {
	namespace: 'forceChangePassword',

	state: {

	},

	subscriptions: {

	},

	effects: {
		* forceChangePassword({ payload }, { call }) {
			const { code, errMsg } = yield call(forceChangePassword, payload);
			if (code !== 0) {
				message.error(errMsg);
				return;
			}
			message.success(localeMessage('common.changePassword.ok'));
			router.goBack();
		},

	},

	reducers: {

	},

};
