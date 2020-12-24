import request from '@/utils/request';

export async function retrievePwdArtificialReview(data) {
	return request('/api/sys/retrievePwdArtificialReview', {
		method: 'post',
		data,
	});
}

