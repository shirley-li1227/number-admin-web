import { message } from 'antd';
import {
	retrievePwdArtificialReview,
} from '@/services/user/manualReview';

export default {
	namespace: 'manualReview',
	state: {
		manualReviewInfo: {},
		submitState: '1'
	},
	subscriptions: {},
	effects: {
		*retrievePwdArtificialReview({ payload }, { call, put }) {
			const { code, errMsg } = yield call(retrievePwdArtificialReview, payload);
			if (code === 0) {
				yield put({
					type: 'changeState',
					payload: {
						submitState: '2'
					},
				});
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
