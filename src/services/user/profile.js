import request from '@/utils/request';

//获取个人资料
export async function getMyAccount(data) {
	return request('/api/sys/passport/getMyAccount', {
		method: 'get',
		data
	});
}

//保存个人资料
export async function updateMyAccount(data) {
	return request('/api/sys/passport/updateMyAccount', {
		method: 'post',
		formData: true,
		data,
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

//验证手机号
export async function checkMobileCheckCode(data) {
	return request('/api/sys/passport/checkMobileCheckCode', {
		method: 'post',
		formData: true,
		data,
	});
}


//更换手机号
export async function changeMobile(data) {
	return request('/api/sys/passport/changeMobile', {
		method: 'post',
		formData: true,
		data,
	});
}
//发送邮箱验证码
export async function sendEmailCheckCode(data) {
	return request('/api/sys/passport/sendEmailCheckCode', {
		method: 'post',
		formData: true,
		data,
	});
}

//验证邮箱
export async function checkEmailCheckCode(data) {
	return request('/api/sys/passport/checkEmailCheckCode', {
		method: 'post',
		formData: true,
		data,
	});
}

//更换通过邮箱更改的手机号
export async function changeMobileByEmail(data) {
	return request('/api/sys/passport/changeMobileByEmail', {
		method: 'post',
		formData: true,
		data,
	});
}

//更换绑定邮箱
export async function changeEmailByMobile(data) {
	return request('/api/sys/passport/changeEmailByMobile', {
		method: 'post',
		formData: true,
		data,
	});
}

//绑定邮箱
export async function bindEmail(data) {
	return request('/api/sys/passport/bindEmail', {
		method: 'post',
		formData: true,
		data,
	});
}
