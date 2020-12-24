//非中文 （物流单号：支持英文数字特殊符号）
import { localeMessage } from "./index";

// 获取码段
export const CODE = /[1-9]{1}\d{0,}.[123]{1}[01]{1}.(\d{20}|\d{13})/;

export const ValidatorCode = /([1-9]{1}\d{0,}.[123]{1}[01]{1}.(\d{20}|\d{13}))|(^\d{13}$)/;

export const ORDER = /^[^\u4e00-\u9fa5]*$/;
//网站
export const LINK = /(https?):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/;

//手机号
export const PHONE = /^1[3456789]\d{9}$/;

// 座机
export const FIXEDPHONE = /^([0-9]|[-])+$/;

//真实姓名2-4个中文字符
export const REALNAME = /^[\u4e00-\u9fa5]{2,4}$/;
//身份证
// export const IDNUMBER = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
export const IDNUMBER = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
//邮箱
export const EMAIL = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/;

//验证地址
export const validatorAddress = (rule, value, callback) => {
	const { region, address } = value;
	region && region.length && address
		? callback()
		: callback(localeMessage("utils.validatorAddress"));
};

//金额
export const MONEY = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

// 正整数
export const INT = /^[1-9]\d*$/;
// 正数的正则表达式(不包括0，小数保留两位)
export const FLOATCASH = /\d+(\.\d{0,2})?/;

// 数字0-9
export const COUNT = /^[0-9]\d*$/;

// 小数0-9
export const DECIMAL = /^([1-9]\d*|0)(\.\d*[1-9])?$/;

// 英文数字
export const ACCOUNT = /^[A-Za-z0-9]*$/;

//密码必须6~12位
export const PASSWD = /(.+){6,12}$/;

// 概率
export const RATE = /^([1-9][\d]{0,}|0)(\.[\d]{1,2})?$/;

export const validatorPasswd = (rule, value, callback) => {
	const reg = /^[\S]{6,16}$/;
	value = (value || "").trim();
	if (value) {
		if (!reg.test(value)) {
			callback("密码必须6~16位");
			return;
		}
	}
	callback();
};
//联系人只能选择3个
export const validatorContactPerson = (rule, value, callback) => {
	if (value) {
		if (value.length > 3) {
			callback(localeMessage("utils.validatorContactPerson"));
			return;
		}
	}
	callback();
};

// 多个邮箱地址验证
export const validatorEmails = (rule, value, callback) => {
	value = (value || "").trim();
	const reg = EMAIL;
	if (value) {
		const arr = value.split(";");
		for (let i in arr) {
			if (arr[i] && !reg.test(String(arr[i]).trim())) {
				callback(localeMessage("utils.validatorEmails"));
				return;
			}
		}
	}
	callback();
};
// 有效期时间验证
export const validatorShelfLife = (rule, value, callback) => {
	const reg = /^\d{1,5}$/;
	if (value) {
		const { number, type } = value;
		if (!reg.test(number)) {
			callback(localeMessage("utils.validatorShelfLife"));
			return;
		}
		if (!type) {
			callback(localeMessage("utils.validatorShelfLife.type"));
			return;
		}
	}
	callback();
};

// 营业期限验证
export const validatorCooperationDate = (rule, value, callback) => {
	if (value) {
		if (!value.startDate) {
			callback(localeMessage("utils.validatorCooperationDate.startDate"));
			return;
		}

		if (!value.longTerm && !value.endDate) {
			callback(localeMessage("utils.validatorCooperationDate.endDate"));
			return;
		}
	}
	callback();
};
// 办公电话验证
export const areaPhone = (rule, value, callback) => {
	const reg = /^[0-9]\d*$/;
	if (value) {
		const phoneArr = value.split("-");
		const len = phoneArr[2] ? 3 : 2;
		for (let i in phoneArr) {
			if (i < len && !reg.test(phoneArr[i])) {
				callback(localeMessage("utils.areaPhone"));
				return;
			}
		}
	}
	callback();
};

// 数字最大位数
export const MaxLenNumber = ({ value, callback, maxLen, message } = {}) => {
	if (value) {
		const str = String(value);
		if (str.length > maxLen) {
			callback(message);
			return;
		}
	}

	callback();
};

export const validatorRangeNumer = ({
	value,
	callback,
	max,
	min,
	message
} = {}) => {
	if (value) {
		if (min !== undefined && Number(value) < min) {
			return callback(message);
		}

		if (max !== undefined && Number(value) > max) {
			return callback(message);
		}
	}

	callback();
};
