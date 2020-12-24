import request from '@/utils/request';

//获取公司基本信息
export const fakeCompany = async () => {
	return request('/api/sys/company/baseInfo', {
		method: 'get'
	});
};

//获取公司营业执照
export const fakeLicense = async () => {
	return request('/api/sys/company/businessLicenseInfo', {
		method: 'get'
	});
};

//获取公司营业执照审核记录
export const fakeLicenseRecord = async () => {
	return request('/api/sys/company/getAuditingLicenseRecord', {
		method: 'get'
	});
};


//保存公司基本信息
export const fakeSaveCompany = async ({
	contactEmail,
	addressInfo,
	provinceId,
	cityId,
	districtId,
	contactPerson,
	contactPhone,
	englishName,
	portal,
} = {}) => {
	return request('/api/sys/company', {
		method: 'put',
		data: {
			contactEmail,
			addressInfo,
			provinceId,
			cityId,
			districtId,
			contactPerson,
			contactPhone,
			englishName,
			portal,
		}
	});
};

export const updateBusinessLicense = async ({
	companyName,
	licenseCopyUrl,
	uscc,
	operatingPeriodBeginDate,
	operatingPeriodEndDate,
	longTerm,
	mobileCheckCode,
	mobileTokenId
} = {}) => {
	return request('/api/sys/company/editBusinessLicense', {
		method: 'post',
		data: {
			companyName,
			licenseCopyUrl,
			uscc,
			operatingPeriodBeginDate,
			operatingPeriodEndDate,
			longTerm,
			mobileCheckCode,
			mobileTokenId
		}
	});
};
