import request from '@/utils/request';

export async function changePasswordByMobile(data) {
	return request('/api/sys/passport/changePasswordByMobile', {
		method: 'post',
		formData: true,
		data,
	});
}
export async function changePassword(data) {
	return request('/api/sys/passport/changePassword', {
		method: 'post',
		formData: true,
		data,
	});
}

//获取个人资料
export async function getMyAccount(data) {
	return request('/api/sys/passport/getMyAccount', {
		method: 'get',
		data
	});
}
//发送短信验证码
export async function sendCheckCode(data) {
	return request('/api/sys/passport/sendCheckCode', {
		method: 'post',
		formData: true,
		data,
	});
}
