
import request from '@/utils/request';

//获取行业类目选项数据
export async function getFirstCategoryList(data) {
	return request('/api/sys/productCategory/getFirstCategoryList', {
		method: 'get',
		data
	});
}
//提交
export async function companyRegister(data) {
	return request('/api/sys/company/companyRegister', {
		method: 'post',
		data
	});
}

//获取详情
export async function getCompanyRegistrationInfo(data) {
	return request('/api/sys/company/getCompanyRegistrationInfo', {
		method: 'get',
		data
	});
}
//获取详情
export async function checkUsccIsExisted(data) {
	return request('/api/sys/companyBusinessLicenseRecord/checkUsccIsExisted', {
		method: 'get',
		data
	});
}
