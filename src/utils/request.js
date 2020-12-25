import fetch from "dva/fetch";
// import { notification } from 'antd';
import router from "umi/router";

import qs from "qs";
import { BASEURL } from "../const";

const codeMessage = {
	200: "服务器成功返回请求的数据。",
	201: "新建或修改数据成功。",
	202: "一个请求已经进入后台排队（异步任务）。",
	204: "删除数据成功。",
	400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
	401: "用户没有权限（令牌、用户名、密码错误）。",
	403: "用户得到授权，但是访问是被禁止的。",
	404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
	406: "请求的格式不可得。",
	410: "请求的资源被永久删除，且不会再得到的。",
	422: "当创建一个对象时，发生一个验证错误。",
	500: "服务器发生错误，请检查服务器。",
	502: "网关错误。",
	503: "服务不可用，服务器暂时过载或维护。",
	504: "网关超时。"
};

const checkStatus = response => {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	const errortext = codeMessage[response.status] || response.statusText;
	// notification.error({
	// 	message: `请求错误 ${response.status}: ${response.url}`,
	// 	description: errortext,
	// });
	const error = new Error(errortext);
	error.name = response.status;
	error.response = response;
	throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to 'fetch'
 * @return {object}           An object containing either 'data' or 'err'
 */
export default function request(
	url,
	{ method = "get", data, formData = false, ContentType } = {}
) {
	const token = localStorage.getItem("admin-token");
	const defaultHeader = {
		// "X-Requested-With": "XMLHttpRequest"
		// JSESSIONID: "dingtalk-admin"
	};
	if (token) defaultHeader["X-CSRF-TOKEN"] = token;
	const options = {
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json"
		},
		method,
		body: data,
		formData
	};

	url = BASEURL + url;
	let newOptions = { ...options };
	if (method.toUpperCase() === "GET") {
		url += data ? `?${qs.stringify(data, { indices: false })}` : "";
		newOptions.body = null;
	} else {
		if (!(newOptions.body instanceof FormData)) {
			if (formData) {
				if (!newOptions.body) {
					newOptions.body = null;
				} else {
					const params = newOptions.body;
					if (ContentType === "multipart/form-data") {
						console.log(ContentType);
						const formData = new FormData();
						Object.keys(params).map(item => {
							formData.append(item, params[item]);
						});
						newOptions.body = formData;
						newOptions.headers = {};
					} else {
						const dataString = Object.keys(params)
							.map(item => {
								return `${item}=${params[item]}`;
							})
							.join("&");
						newOptions.body = dataString;
						newOptions.headers = {
							"Content-Type": "application/x-www-form-urlencoded"
						};
					}
				}
			} else {
				newOptions.body = newOptions.body
					? JSON.stringify(newOptions.body)
					: null;
			}
		}
	}
	newOptions.headers = Object.assign({}, newOptions.headers, defaultHeader);
	console.log("newOptions :>> ", newOptions);
	//添加域名
	return fetch(url, newOptions)
		.then(checkStatus)
		.then(response => {
			// DELETE and 204 do not return data by default
			// using .json will report an error.
			const token = response.headers.get("X-CSRF-TOKEN");
			const JSESSIONID = response.headers.get("Set-Cookie");
			console.log("token :>> ", token);
			console.log("JSESSIONID :>> ", JSESSIONID);
			if (token) {
				localStorage.setItem("admin-token", token);
			}
			if (response.status === 204) {
				return response.text();
			}
			return response.json();
		})
		.catch(e => {
			router.push({
				pathname: "/500",
				query: {
					status
				}
			});
		});
}
