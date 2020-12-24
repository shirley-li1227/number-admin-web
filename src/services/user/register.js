import request from '@/utils/request';

//获得注册协议
export async function getAgreement({ mobile } = {}) {
	return request('/api/sys/registrationAgreement/getByType', {
		method: 'get',
		data: {
			type: 1,
		},
	});
}
//验证手机号是否已经被注册
export async function isMobileBound({ mobile } = {}) {
	return request('/api/sys/passport/isMobileBound', {
		method: 'get',
		data: {
			mobile,
		},
	});
}

//获取短信验证码
export async function sendCheckCodeForRegister({ cellphone, imageCheckCode } = {}) {
	return request('/api/sys/passport/sendCheckCodeForRegister', {
		method: 'POST',
		data: {
			cellphone,
			imageCheckCode,
		},
		formData: true
	});
}

//手机验证
export async function checkMobileForRegister({ cellphone, imageCheckCode, checkCode, tokenId } = {}) {
	return request('/api/sys/passport/checkMobileForRegister', {
		method: 'POST',
		data: {
			mobile: cellphone,
			imageCheckCode,
			checkCode,
			tokenId
		},
		formData: true
	});
}
//注册提交
export async function createUserForRegister(params) {
	return request('/api/sys/passport/createUserForRegister', {
		method: 'POST',
		data: params
	});
}
