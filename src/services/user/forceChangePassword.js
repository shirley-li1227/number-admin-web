import request from '@/utils/request';

export async function forceChangePassword(data) {
	return request('/api/sys/passport/forceChangePassword', {
		method: 'post',
		formData: true,
		data,
	});
}


