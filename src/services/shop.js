import request from "@/utils/request";
import { async } from "q";

// 分页查询列表
export const fetchList = async data => {
	return request("/api/admin/v1/shop/list", {
		method: "POST",
		data,
		formData: true
	});
};

// 设置启用/禁用
export const setEnabled = async ({ id, isEnabled }) => {
	return request("/api/sys/orgDealer/setEnabled", {
		method: "POST",
		data: {
			id,
			isEnabled
		},
		formData: true
	});
};

// 删除
export const remove = async id => {
	return request(`/api/sys/orgDealer/${id}`, {
		method: "delete"
	});
};

// 详情
export const detail = async id => {
	return request(`/api/sys/orgDealer/${id}`, {
		method: "get"
	});
};
// 下载
export const downloadCsv = async id => {
	return request("/api/sys/orgDealer/downloadCsvTemplate", {
		method: "get"
	});
};
// 导入
export const importCsv = async file => {
	return request("/api/sys/orgDealer/importExcel", {
		method: "post",
		data: { file },
		formData: true,
		ContentType: "multipart/form-data"
		//ContentType: 'application/x-www-form-urlencoded;'
	});
};
//历史记录
export const getCsvImportRecord = async id => {
	return request("/api/sys/orgDealer/getCsvImportRecord", {
		method: "get"
	});
};

// 添加
export const add = async data => {
	return request("/api/sys/orgDealer", {
		method: "post",
		data
	});
};

// 编辑
export const edit = async data => {
	return request("/api/sys/orgDealer", {
		method: "put",
		data
	});
};

// 自动生成客户代码
export const generateCode = async () => {
	return request("/api/sys/orgDealer/generateCode", {
		method: "get"
	});
};

// 客户代码是否已被使用
export const isCodeExisted = async data => {
	return request("/api/sys/orgDealer/isCodeExisted", {
		method: "get",
		data
	});
};

// 修改销售范围
export const updateSalesScope = async ({ dealerId, salesScopeRegionIds }) => {
	return request("/api/sys/orgDealer/updateSalesScope", {
		method: "post",
		formData: true,
		data: {
			dealerId,
			salesScopeRegionIds
		}
	});
};

// 查询所有客户
export const getDealerAll = async ({ isEnabled = true } = {}) => {
	return request("/api/sys/orgDealer/listAll", {
		method: "get",
		data: {
			isEnabled
		}
	});
};
