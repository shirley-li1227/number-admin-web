import request from '@/utils/request';
//填写账户名
export async function getUserCheckInfo({ username, imageCheckCode } = {}) {
	return request('/api/sys/retrievePassword/getUserCheckInfo', {
		method: 'GET',
		data: {
			username,
			imageCheckCode,
		},
	});
}
//获取邮箱验证码
export async function emailCaptcha({ username } = {}) {
	return request('/api/sys/retrievePassword/sendEmailCheckCode', {
		method: 'POST',
		data: {
			username
		},
		formData: true,
	});
}

//获取手机验证码
export async function mobileCaptcha({ username } = {}) {
	return request('/api/sys/retrievePassword/sendMobileCheckCode', {
		method: 'POST',
		data: {
			username
		},
		formData: true,
	});
}
//手机验证
export async function checkMobileCheckCode({ username, tokenId, checkCode } = {}) {
	return request('/api/sys/retrievePassword/checkMobileCheckCode', {
		method: 'POST',
		data: {
			username,
			tokenId,
			checkCode,
		},
		formData: true,
	});
}
//邮箱验证
export async function checkEmailCheckCode({ username, tokenId, checkCode } = {}) {
	return request('/api/sys/retrievePassword/checkEmailCheckCode', {
		method: 'POST',
		data: {
			username,
			tokenId,
			checkCode,
		},
		formData: true,
	});
}
//设置新密码
export async function changePwd({ username, tokenId, checkCode, newPassword, rePassword, checkType } = {}) {
	return request('/api/sys/retrievePassword/changePwd', {
		method: 'POST',
		data: {
			username,
			tokenId,
			checkCode,
			newPassword,
			rePassword,
			checkType,
		},
		formData: true,
	});
}
