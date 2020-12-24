import request from "@/utils/request";

//用户登录
export async function fakeLogin(data) {
	return request("/user/login", {
		method: "post",
		formData: true,
		data
	});
}

export async function fakeLogout() {
	return request("/api/sys/passport/logout", {
		method: "POST"
	});
}

//判断企业信息状态
export async function getOrgRegistrationStatus(data) {
	return request("/api/sys/passport/getOrgRegistrationStatus", {
		method: "get",
		data
	});
}
//第一次登陆调用，更改登录状态
export async function isLoginedAfterAuthorized() {
	return request("/api/sys/company/isLoginedAfterAuthorized", {
		method: "post"
	});
}
