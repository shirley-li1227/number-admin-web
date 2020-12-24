import request from '@/utils/request';

//获取菜单
export async function fakeMenu() {
	return request('/api/sys/passport/getMyModuleList', {
		method: 'get'
	});
}

// 获取所有功能权限
export async function queryAuthList() {
	return request('/api/sys/passport/getUserAllModuleBtnList', {
		method: 'get'
	});
}


//获取未读消息数
export const fakeUnReadMsgCount = async () => {
	return request('/api/sys/orgUserSiteMsg/unreadMsgQty', {
		method: 'get'
	});
};

//获取当前用户信息
export const fakeUserInfo = async () => {
	return request('/api/sys/passport/getMyAccount', {
		method: 'get'
	});
};

//获取验证码
export const getCaptcha = async () => {
	return request('/api/sys/passport/captcha', {
		method: 'get'
	});
};

//获取省市区地址
export const fakeRegion = async () => {
	return request('/api/sys/addressRegion/getTreeForSelect', {
		method: 'get'
	});
};

//获取所有品牌列表
export const fakeBrandList = async () => {
	return request('/api/sys/brand/getSelectList', {
		method: 'get'
	});
};

//获取所有品牌列表 用户所拥有的权限
export const getUserBrandList = async ({ isEnabled = true } = {}) => {
	return request('/api/sys/brand/getUserBrandList', {
		method: 'get',
		data: {
			isEnabled,
		}
	});
};

//获取品牌下所有兴业类目
export const fakeProductCategoryByBrandId = async ({
	brandId
} = {}) => {
	return request('/api/sys/productCategory/getSelectTree', {
		method: 'get',
		data: {
			brandId,
		}
	});
};

// 获取用户手机号
export const fakeAppMobile = async () => {
	return request('/api/ebc/genCodeOrderLabel/getApplicationMobile', {
		method: 'get'
	});
};

// 发送验证码
export const fakeSendCheckCode = async () => {
	return request('/api/ebc/genCodeOrderLabel/sendCheckCode', {
		method: 'POST'
	});
};
//获取联系人列表
export const getContactPersonList = async () => {
	return request('/api/sys/orgauthuser/getContactPersonList', {
		method: 'get'
	});
};

// 根据产品ID获取产品赋码单位
export const findPackUnitByProduct = async (data) => {
	return request('/api/sys/productPackage/findByProduct', {
		method: 'get',
		data
	});
};

// 获取国家树形结构
export const queryContryList = async ({
	orderType = 1
} = {}) => {
	return request('/api/sys/addressRegion/getCountryList', {
		method: 'get',
		data: {
			orderType
		}
	});
};
