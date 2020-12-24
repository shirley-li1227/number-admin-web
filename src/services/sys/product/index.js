import request from "@/utils/request";

//查询产品明细
export const fakeProductList = async data => {
	return request("/api/sys/product/list", {
		method: "get",
		data
	});
};

//查询产品明细 根据用户权限获取数据
export const getProductListByUser = async data => {
	return request("/api/sys/product/listByUser", {
		method: "get",
		data
	});
};

//启用禁用
export const setEnable = async data => {
	return request("/api/sys/product/setEnable", {
		method: "post",
		data,
		formData: true
	});
};
//判断是否有关联编码
export const checkProductRelationCode = async data => {
	return request("/api/ebc/productionCode/checkProductRelationCode", {
		method: "get",
		data
	});
};
//删除
export const logicDelete = async data => {
	return request("/api/sys/product/logicDelete/" + data.id, {
		method: "post"
	});
};

//品牌下拉选项
export const getSelectList = async () => {
	return request("/api/sys/brand/getSelectList", {
		method: "get"
	});
};

//品牌下拉选项
export const shelfLifeUnitType = async () => {
	return request("/api/sys/product/shelfLifeUnitType", {
		method: "get"
	});
};
//根据品牌ID获取行业类目下拉选项
export const getUITree = async data => {
	return request("/api/sys/productCategory/getUITree", {
		method: "get",
		data
	});
};
//根据品牌ID获取行业类目下拉选项
export const getStaticAttrOptList = async data => {
	return request("/api/sys/product/getStaticAttrOptList", {
		method: "get",
		data
	});
};
//是否有有效期
export const existPackDate = async data => {
	return request("/api/sys/product/existPackDate", {
		method: "get",
		data
	});
};
//根据品牌ID获取行业类目下拉选项
export const add = async data => {
	return request("/api/sys/product/add", {
		method: "post",
		data
	});
};
//编辑
export const update = async data => {
	return request("/api/sys/product", {
		method: "put",
		data
	});
};

//获取修改前数据
export const getProductInfo = async data => {
	return request("/api/sys/product/" + data.id, {
		method: "get"
	});
};
//获取产品图片
export const listByProduct = async data => {
	return request("/api/sys/productimg/listByProduct", {
		method: "get",
		data
	});
};

//获取产品图片
export const getByBrandId = async data => {
	return request("/api/sys/product/getByBrandId?brandId=" + data.id, {
		method: "get"
	});
};

// 获取产品列表
export const productSelectList = async ({ isEnabled = true } = {}) => {
	return request("/api/sys/product/selectList", {
		method: "get",
		data: {
			isEnabled
		}
	});
};

// 获取印刷厂关联的产品列表
export const getProductBySupplier = async ({ id } = {}) => {
	return request("/api/sys/product/selectList", {
		method: "get",
		data: {
			id
		}
	});
};

//品牌所有
export const getBrandAll = async () => {
	return request("/api/sys/brand/listAll", {
		method: "get"
	});
};

// 下载
export const downloadCsv = async id => {
	///api/ebc/productionBatch/downloadExcelTemplate
	///api/ebc/productionBatch/downloadCsvTemplate
	return request("/api/ebc/productionBatch/downloadExcelTemplate", {
		method: "get"
	});
};
// 导入
export const importCsv = async file => {
	///api/ebc/productionBatch/importCsv
	return request("/api/ebc/productionBatch/importExcel", {
		method: "post",
		data: { file },
		formData: true,
		ContentType: "multipart/form-data"
		//ContentType: 'application/x-www-form-urlencoded;'
	});
};
//历史记录
export const getCsvImportRecord = async id => {
	return request("/api/ebc/productionBatch/getCsvImportRecord", {
		method: "get"
	});
};
