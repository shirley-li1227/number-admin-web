import moment from "moment";
import React from "react";
import nzh from "nzh/cn";
import { parse, stringify } from "qs";
import { formatMessage } from "umi/locale";
import Big from "big.js";

//components
import ESAddress from "@/components/esAddress";
import ESAreaPhone from "@/components/esAreaPhone";
import ESUpload from "@/components/esUpload";
import ESCooperationDate from "@/components/esCooperationDate";
import ESInputSelect from "@/components/esInputSelect";
import ESCustomDate from "@/components/esCustomDate";
import ESMonthRange from "@/components/esMonthRange";
import ESAuth from "@/components/esAuth";
import ESCropper from "@/components/esCropper";
import ESLabel from "@/components/esLabel";
import ESTimeGranularity from "@/components/esTimeGranularity";
import ESTreeWithButton from "@/components/esTreeWithButton";
import QRCode from "qrcode.react";
import {
	Input,
	InputNumber,
	Select,
	DatePicker,
	Tree,
	Cascader,
	TreeSelect,
	Radio,
	Switch,
	Checkbox,
	Tooltip,
	Icon
} from "antd";

import { H5URL } from "@/const";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TreeNode } = Tree;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

/**
 * 保留小数位 多余的舍去 不足的补零
 */
Number.prototype.toFloor = function(x) {
	const temp = String(this).split(".");
	const n = temp[0];
	let d = temp[1] || "";
	d = d.substring(0, x);
	return Number(n + "." + d).toFixed(x);
};

String.prototype.toRGBA = function() {
	let color = this.toLowerCase();
	let pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
	if (color && pattern.test(color)) {
		if (color.length === 4) {
			// 将三位转换为六位
			color =
				"#" +
				color[1] +
				color[1] +
				color[2] +
				color[2] +
				color[3] +
				color[3];
		}
		//处理六位的颜色值
		let colorNew = [];
		for (let i = 1; i < 7; i += 2) {
			colorNew.push(parseInt("0x" + color.slice(i, i + 2)));
		}
		return "rgba(" + colorNew.join(",") + ", 1)";
	}
	return color;
};

//获取国际化文本
export const localeMessage = (id, values = {}) => {
	return formatMessage({ id }, { ...values });
};

export const getSildeMenuWidth = collapsed => {
	return collapsed ? "60px" : "220px";
};

export function fixedZero(val) {
	return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
	const now = new Date();
	const oneDay = 1000 * 60 * 60 * 24;

	if (type === "today") {
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		return [moment(now), moment(now.getTime() + (oneDay - 1000))];
	}

	if (type === "week") {
		let day = now.getDay();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);

		if (day === 0) {
			day = 6;
		} else {
			day -= 1;
		}

		const beginTime = now.getTime() - day * oneDay;

		return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
	}

	if (type === "month") {
		const year = now.getFullYear();
		const month = now.getMonth();
		const nextDate = moment(now).add(1, "months");
		const nextYear = nextDate.year();
		const nextMonth = nextDate.month();

		return [
			moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
			moment(
				moment(
					`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
				).valueOf() - 1000
			)
		];
	}

	const year = now.getFullYear();
	return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = "") {
	const arr = [];
	nodeList.forEach(node => {
		const item = node;
		item.path = `${parentPath}/${item.path || ""}`.replace(/\/+/g, "/");
		item.exact = true;
		if (item.children && !item.component) {
			arr.push(...getPlainNode(item.children, item.path));
		} else {
			if (item.children && item.component) {
				item.exact = false;
			}
			arr.push(item);
		}
	});
	return arr;
}

export function digitUppercase(n) {
	return nzh.toMoney(n);
}

function getRelation(str1, str2) {
	if (str1 === str2) {
		console.warn("Two path are equal!"); // eslint-disable-line
	}
	const arr1 = str1.split("/");
	const arr2 = str2.split("/");
	if (arr2.every((item, index) => item === arr1[index])) {
		return 1;
	}
	if (arr1.every((item, index) => item === arr2[index])) {
		return 2;
	}
	return 3;
}

function getRenderArr(routes) {
	let renderArr = [];
	renderArr.push(routes[0]);
	for (let i = 1; i < routes.length; i += 1) {
		// 去重
		renderArr = renderArr.filter(
			item => getRelation(item, routes[i]) !== 1
		);
		// 是否包含
		const isAdd = renderArr.every(
			item => getRelation(item, routes[i]) === 3
		);
		if (isAdd) {
			renderArr.push(routes[i]);
		}
	}
	return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
	let routes = Object.keys(routerData).filter(
		routePath => routePath.indexOf(path) === 0 && routePath !== path
	);
	// Replace path to '' eg. path='user' /user/name => name
	routes = routes.map(item => item.replace(path, ""));
	// Get the route to be rendered to remove the deep rendering
	const renderArr = getRenderArr(routes);
	// Conversion and stitching parameters
	const renderRoutes = renderArr.map(item => {
		const exact = !routes.some(
			route => route !== item && getRelation(route, item) === 1
		);
		return {
			exact,
			...routerData[`${path}${item}`],
			key: `${path}${item}`,
			path: `${path}${item}`
		};
	});
	return renderRoutes;
}

export function getPageQuery() {
	return parse(window.location.href.split("?")[1]);
}

export function getQueryPath(path = "", query = {}) {
	const search = stringify(query);
	if (search.length) {
		return `${path}?${search}`;
	}
	return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
	return reg.test(path);
}

export function formatWan(val) {
	const v = val * 1;
	if (!v || Number.isNaN(v)) return "";

	let result = val;
	if (val > 10000) {
		result = Math.floor(val / 10000);
		result = (
			<span>
				{result}
				<span
					styles={{
						position: "relative",
						top: -2,
						fontSize: 14,
						fontStyle: "normal",
						lineHeight: 20,
						marginLeft: 2
					}}
				/>
			</span>
		);
	}
	return result;
}

// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
// eslint-disable-next-line import/prefer-default-export
export function urlToList(url) {
	const urllist = url.split("/").filter(i => i);
	return urllist.map(
		(urlItem, index) => `/${urllist.slice(0, index + 1).join("/")}`
	);
}

/**
 * @param {*} list = [
 *  { key, title, children }
 * ]
 */
const renderTreeNodes = list => {
	return list.map(item => {
		if (item.children) {
			return (
				<TreeNode title={item.title} key={item.key} dataRef={item}>
					{renderTreeNodes(item.children)}
				</TreeNode>
			);
		}
		return <TreeNode {...item} />;
	});
};

//根据数据 获取组件
export const getField = (
	field,
	allowClear = true,
	changeSelectString = false
) => {
	const { value, ...opt } = field;
	const data = field.useValue ? { ...field } : { ...opt };
	const { type, options = [], hasAll, noStyle, ...props } = data;
	let com;
	switch (type) {
		case "esLabel":
			com = <ESLabel {...props} />;
			break;
		case "label":
			com = (
				<div className="es-label" {...props}>
					{value}
				</div>
			);
			break;
		case "input":
			com = <Input {...props} />;
			break;
		case "password":
			com = <Input type="password" {...props} />;
			break;
		case "textarea":
			com = <TextArea {...props} />;
			break;
		case "select":
			com = (
				<Select
					style={{ minWidth: 80 }}
					allowClear={allowClear}
					dropdownStyle={{ zIndex: 998 }}
					{...props}
				>
					{hasAll ? (
						<Select.Option key="-1" value=" ">
							{localeMessage("common.options.all")}
						</Select.Option>
					) : null}
					{options.map((item, index) => (
						<Select.Option
							key={index}
							value={
								changeSelectString
									? String(item.value || item.id)
									: item.value || item.id
							}
							disabled={item.disabled}
						>
							{props.formatter
								? props.formatter(item)
								: item.name}
						</Select.Option>
					))}
				</Select>
			);
			break;
		case "checkbox":
			com = <CheckboxGroup options={options} {...props} />;
			break;
		case "render":
			const { render } = props;
			com = render;
			break;
		case "upload":
			com = <ESUpload {...props} />;
			break;
		case "rangePicker":
			com = <RangePicker popupStyle={{ zIndex: 998 }} {...props} />;
			break;
		case "datePicker":
			com = <DatePicker popupStyle={{ zIndex: 998 }} {...props} />;
			break;
		case "tree":
			const { treeData } = props;
			com = <Tree {...props}>{renderTreeNodes(treeData)}</Tree>;
			break;
		case "cascader":
			com = <Cascader options={options} {...props} />;
			break;
		case "inputNumber":
			com = <InputNumber style={{ width: "100%" }} {...props} />;
			break;
		case "esAddress":
			com = <ESAddress options={options} {...props} />;
			break;
		case "esAreaPhone":
			com = <ESAreaPhone {...props} />;
			break;
		case "treeSelectMultiple":
			com = (
				<TreeSelect
					multiple={true}
					showCheckedStrategy={TreeSelect.SHOW_PARENT}
					treeCheckable={true}
					dropdownStyle={{ zIndex: 998 }}
					{...props}
				/>
			);
			break;
		case "treeWithButton":
			com = (
				<ESTreeWithButton
					multiple={true}
					showCheckedStrategy={TreeSelect.SHOW_PARENT}
					treeCheckable={true}
					dropdownStyle={{ zIndex: 998 }}
					dprops={{ ...props }}
				/>
			);
			break;
		case "radio":
			com = (
				<RadioGroup {...props}>
					{options.map((item, index) => (
						<Radio
							key={index}
							value={item.id === undefined ? item.value : item.id}
							disabled={item.disabled}
						>
							{item.name}
						</Radio>
					))}
				</RadioGroup>
			);
			break;
		case "radioButton":
			com = (
				<RadioGroup {...props}>
					{options.map((item, index) => (
						<Radio.Button
							key={index}
							value={item.id === undefined ? item.value : item.id}
						>
							{item.name}
						</Radio.Button>
					))}
				</RadioGroup>
			);
			break;
		case "img":
			com = (
				<img
					src={props.src}
					style={{
						width: 120,
						height: 120,
						verticalAlign: "middle",
						marginTop: 10,
						objectFit: "contain"
					}}
					alt=""
				/>
			);
			break;
		case "imgList":
			const imgList = props.imgList || [];
			com = (
				<div style={{ marginTop: 10 }}>
					{imgList.map((item, index) => (
						<img
							style={{
								width: 120,
								height: 120,
								verticalAlign: "middle",
								marginRight: 20,
								objectFit: "contain"
							}}
							src={item}
							key={index}
							alt=""
						/>
					))}
				</div>
			);
			break;
		case "esCooperationDate":
			com = <ESCooperationDate {...props} />;
			break;
		case "esInputSelect":
			com = <ESInputSelect options={options} {...props} />;
			break;
		case "esCustomDate":
			com = <ESCustomDate {...props} />;
			break;
		case "esTimeGranularity":
			com = <ESTimeGranularity {...props} />;
			break;
		case "esMonthRange":
			com = <ESMonthRange {...props} />;
			break;
		case "esCropper":
			com = <ESCropper {...props} />;
			break;
		default:
			throw new Error(localeMessage("utils.error.type", { type }));
	}
	return com;
};

export const arrayToTree = (list, pid, pidName, name) => {
	return list
		.filter(obj => obj[pidName] === pid)
		.map(obj => {
			const children = arrayToTree(list, obj[name], pidName, name);
			return {
				...obj,
				value: String(obj.id),
				children: children.length ? children : undefined
			};
		});
};

export const treeToArray = (tree, childName, pidName, pid) => {
	let list = [];
	const fields = childName.split(".");
	const getChild = obj => {
		let result = obj;
		fields.forEach(field => {
			result = result[field];
		});

		return result;
	};
	tree.forEach(obj => {
		list.push({
			...obj,
			pid
		});

		const children = getChild(obj);
		if (children && children.length) {
			const childList = treeToArray(
				children,
				childName,
				pidName,
				obj[pidName]
			);
			list = list.concat(childList);
		}
	});
	return list;
};

export const formatMonth = date => {
	return date ? moment(date).format("YYYY-MM") : "";
};
export const formatDate = date => {
	return date ? moment(date).format("YYYY-MM-DD") : "";
};

export const formatDateTime = (date, format = "YYYY-MM-DD HH:mm:ss") => {
	return date ? moment(date).format(format) : date;
};

//手机号码转换成带*格式
export const secretMobile = mobile => {
	return mobile
		? `${mobile.substr(0, 3)}****${mobile.substr(7, mobile.length - 7)}`
		: "";
};

export const locationParams = () => {
	const hash = window.location.hash;
	if (hash.indexOf("?") >= 0) {
		return parse(hash.replace(/\#\/.*\?/, ""));
	}

	return {};
};

export const renderTableSwitch = ({
	text,
	record,
	onChange,
	auth,
	disabled,
	render
} = {}) => {
	const str = text
		? localeMessage("common.options.enable")
		: localeMessage("common.options.disable");
	return disabled ? (
		render
	) : (
		<ESAuth auth={auth} render={render ? render : str}>
			<Switch
				size="small"
				checked={text}
				onChange={() => onChange(record)}
			/>
		</ESAuth>
	);
};

// 自动合并表格
export const mergeTableCells = (data, key) => {
	const temp = {};

	const getRowSpan = value => {
		if (!temp[value]) {
			temp[value] = true;
			return data.filter(obj => obj[key] === value).length;
		}
		return 0;
	};

	return data.map(obj => ({
		...obj,
		rowSpan: getRowSpan(obj[key])
	}));
};
//传入日期（前几周）的周一
export const getMonday = (value, week = 0) => {
	return moment(value)
		.week(moment(value).week() - (week ? week - 1 : 0))
		.startOf("week")
		.format("YYYY-MM-DD");
};
//传入日期（前几周）的周日
export const getSunday = (value, week = 0) => {
	return moment(value)
		.week(moment(value).week() - (week ? week - 1 : 0))
		.endOf("week")
		.format("YYYY-MM-DD");
};
// 获取前几天的时间范围
export const getNearDate = days => {
	return [
		formatDate(moment().subtract(days - 1, "days")),
		formatDate(moment())
	];
};
// 获取前几个月的范围
export const getNearMonth = month => {
	return [
		formatMonth(moment().subtract(month - 1, "months")),
		formatMonth(moment())
	];
};
// 格式化防伪溯源码
export const formatQRCode = code => {
	const reg = /[1-9]{1}\d{0,}.[123]{1}[01289]{1}.\d{20}/;
	const temp = reg.exec(code);
	return temp && temp.length ? temp[0] : code;
};

//判断数组中是否包含某个元素（值相等）
export const arrayContain = (array, obj) => {
	for (let i = 0; i < array.length; i++) {
		//如果要求数据类型也一致，这里可使用恒等号===
		if (array[i] == obj) return true;
	}
	return false;
};

export const getAuditStatusText = auditStatus => {
	let txt = "";
	if (auditStatus != null && auditStatus === 20) {
		txt = localeMessage("common.AuditStatusName3");
	} else if (auditStatus != null && auditStatus === 10) {
		txt = localeMessage("common.AuditStatusName2");
	} else if (auditStatus != null && auditStatus === 1) {
		txt = localeMessage("common.AuditStatusWait");
	} else {
		txt = localeMessage("common.AuditStatusName0");
	}
	return txt;
};

export const checkImageSize = ({ width, height, url, isRat = false } = {}) => {
	return new Promise(resolve => {
		let img = new Image();
		img.onload = () => {
			if (isRat) {
				if (img.width / img.height === width / height) {
					resolve(true);
					return;
				}
			} else {
				if (img.width === width && img.height === height) {
					resolve(true);
					return;
				}
			}

			resolve(false);
		};
		img.src = url;
	});
};
const jsMap = [];
export const loadJs = filePath => {
	return new Promise(resolve => {
		if (jsMap.includes(filePath)) {
			resolve();
		} else {
			let myScript = document.createElement("script");
			myScript.type = "text/javascript";
			myScript.addEventListener("load", () => {
				jsMap.push(filePath);
				resolve();
			});
			myScript.src = filePath;
			document.body.appendChild(myScript);
		}
	});
};
const toTimeString = time => {
	// 时间转换方法
	if (time.length) {
		time = [
			time[0].format("YYYY-MM-DD 00:00:00"),
			time[1].format("YYYY-MM-DD 23:59:59")
		];
	}
	return time;
};

// 统计报表获取时间段
export const getDateRange = ({ selectValue, pickerValue } = {}) => {
	let endTime, beginTime;
	if (selectValue === "0") {
		beginTime = pickerValue[0];
		endTime = pickerValue[1];
	} else {
		beginTime = new Date();
		beginTime.setDate(beginTime.getDate() - Number(selectValue));
		beginTime = moment(beginTime).format("YYYY-MM-DD 00:00:00");
		endTime = moment(new Date()).format("YYYY-MM-DD 23:59:59");
	}

	return { beginTime, endTime };
};

// 统计报表获取 折线图 选中和hour day week month 可用状态
export const getDimensions = ({ selectValue, pickerValue } = {}) => {
	const { beginTime, endTime } = getDateRange({ selectValue, pickerValue });
	const days = moment(endTime).diff(moment(beginTime), "day");
	const status = {
		hour: true,
		day: true,
		week: true,
		month: true
	};

	let selected = "";
	if (days <= 7) {
		selected = "day";
		status.week = false;
		status.month = false;
	} else if (days <= 30) {
		selected = "day";
		status.hour = false;
		status.month = false;
	} else {
		selected = "week";
		status.hour = false;
	}

	return {
		dimension: selected,
		dimensionStatus: status
	};
};

export const getRange = (start, end) => {
	const result = [];
	for (let i = start; i < end; i++) {
		result.push(i);
	}
	return result;
};
//map匹配省区名字
export const formatProvinceName = name => {
	let seriesName = name;
	if (name.length > 2) {
		if (name.indexOf("黑龙江") > -1 || name.indexOf("内蒙古") > -1) {
			seriesName = name.substring(0, 3);
		} else {
			seriesName = name.substring(0, 2);
		}
	}
	return seriesName;
};

export const dataURLtoFile = (dataurl, filename) => {
	//将base64转换为文件
	let arr = dataurl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
};

// 获取地图名称 去掉省
export const formatMapRegionName = name => {
	let result = "";
	switch (name) {
		case "内蒙古自治区":
			result = "内蒙古";
			break;
		case "广西壮族自治区":
			result = "广西";
			break;
		case "西藏自治区":
			result = "西藏";
			break;
		case "宁夏回族自治区":
			result = "宁夏";
			break;
		case "新疆维吾尔自治区":
			result = "新疆";
			break;
		case "香港特别行政组区":
			result = "香港";
			break;
		case "澳门特别行政组区":
			result = "澳门";
			break;
		default:
			result = name.replace("省", "");
			break;
	}

	return result;
};

export const formatCategoryList = array => {
	return array.map(obj => {
		const { children, ...props } = obj;

		if (children.length) {
			return {
				...props,
				children: formatCategoryList(children)
			};
		} else {
			return {
				...props
			};
		}
	});
};

export const formatProductUnitList = list => {
	list = list || [];
	const Len = list.length;
	return list.map((obj, index) => {
		const lastString = index < Len - 1 ? "/" : "";
		let packageUnitName = obj.packageUnitName;
		let qtyPackageUnitName = "";
		if (index !== 0) {
			const pre = list[index - 1];
			qtyPackageUnitName = `(${obj.qty + pre.packageUnitName})`;
		}

		if (obj.default) {
			return (
				<span key={index} style={{ lineHeight: "18px" }}>
					<span style={{ fontSize: 14, fontWeight: "bold" }}>
						{packageUnitName}
					</span>
					{qtyPackageUnitName + lastString}
				</span>
			);
		} else {
			return (
				<span key={index}>
					{packageUnitName + qtyPackageUnitName + lastString}
				</span>
			);
		}
	});
};

// 格式化图片宽高
export const formatImageUrlSize = (url, options) => {
	if (!url) return "";

	// base64 图片
	if (url.indexOf("data:image") > -1) return url;

	if (options) {
		url += `?imageView2/2/w/${options.w}/h/${options.h}`;
	}
	return url;
};

// 获取产品包装比例
export const getProductUnitRatio = list => {
	if (!list || list.length < 2) return "";

	const unit1 = list[0];
	const unit2 = list[1];

	return `${unit2.qty}${unit1.packageUnitName}/${unit2.packageUnitName}`;
};

// 格式化产品 包装比例数量
export const getProductNumberByUnitRatio = (count, list) => {
	count = Number.isNaN(count) ? "" : count;
	if (!list || list.length === 0) return count;

	const unit1 = list[0];
	const unit2 = list[1];
	if (unit2) {
		const mod = count % unit2.qty;
		if (mod === 0)
			return Math.floor(count / unit2.qty) + unit2.packageUnitName;

		return (
			Math.floor(count / unit2.qty) +
			unit2.packageUnitName +
			localeMessage("utils.zero") +
			mod +
			unit1.packageUnitName
		);
	}

	// 只有最小单位
	return count + unit1.packageUnitName;
};

// 格式化产品 包装比例数量
export const getNumberUnitByLevel = (count, list, calc = true) => {
	if (count === undefined || count === null) return "";
	if (count === 0) return count;
	if (!list || list.length < 2) return count + localeMessage("utils.unit1");
	const unit2 = list[1];
	return calc
		? Math.floor(count / unit2.qty) + localeMessage("utils.unit2")
		: count + localeMessage("utils.unit2");
};

export const calcUnitCount = (count, list) => {
	if (count === undefined || count === null) return 0;
	if (count === 0) return count;
	if (!list || list.length < 2) return count;
	const unit2 = list[1];
	return Math.floor(count / unit2.qty);
};

// 获取最小 单位名称
export const getMinUnitName = list => {
	if (!list) return "";
	const unit1 = list[0];
	return unit1 ? unit1.packageUnitName : "";
};

export const renderUnitTip = ({
	text,
	record: { productPackageDTOList = [] }
} = {}) => {
	const txt = getProductNumberByUnitRatio(text, productPackageDTOList);
	return productPackageDTOList.length < 2 ? (
		txt
	) : (
		<Tooltip placement="top" title={text}>
			{txt}
		</Tooltip>
	);
};

// 转换成最小单位数量
export const convertToMinUnit = (count, list) => {
	if (!list || list.length < 2) return count;
	const unit2 = list[1];
	return count * unit2.qty;
};

//扫描开始时间-扫描结束时间 计算用时
export const duration = (begin, end) => {
	if (!begin || !end) {
		return "";
	}
	if (begin === end) {
		return "1" + localeMessage("utils.second");
	}
	const date1 = new Date(begin);
	const date2 = new Date(end);
	const s1 = date1.getTime(),
		s2 = date2.getTime();
	const total = (s2 - s1) / 1000;
	const day = parseInt(total / (24 * 60 * 60)); //计算整数天数
	const afterDay = total - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
	const hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
	const afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
	const min = parseInt(afterHour / 60); //计算整数分
	const afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
	const differenceDay = day > 0 ? day + localeMessage("utils.day1") : "";
	const differenceHour = hour > 0 ? hour + localeMessage("utils.hour1") : "";
	const differenceMin = min > 0 ? min + localeMessage("utils.min1") : "";
	const differenceSec =
		afterMin > 0 ? afterMin + localeMessage("utils.second") : "";
	return differenceDay + differenceHour + differenceMin + differenceSec;
};

/**
 * 替换tableColum某个属性
 * @param {*} columns
 * @param {*} items
 * items = {
 *		key: item
 * }
 * key 插入、删除、替换的key
 * item = {
 * 		type: 1 插入 2 替换 0 删除,
 *		list 插入的数据
 * }
 */
export const convertToExportColumns = (columns, items = {}) => {
	for (let key in items) {
		const keyIndex = columns.findIndex(obj => obj.key === key);
		if (keyIndex >= 0) {
			const { type, list = [] } = items[key];
			if (type === 0) {
				columns.splice(keyIndex, 1);
			} else if (type === 1) {
				columns.splice(keyIndex, 0, ...list);
			} else if (type === 2) {
				columns.splice(keyIndex, 1, ...list);
			}
		}
	}
};

//单位显示处理  如：3托(70箱)42箱(6盒)
export const getUnit = data => {
	const unitData = data || [];
	return unitData
		.map((item, index) => {
			const parent =
				item.realQtyPcs > 0
					? `${item.realQtyPcs}${item.packageUnitName}`
					: "";
			const child =
				item.level > 1 && item.realQtyPcs > 0
					? `(${item.qty}${data[index + 1].packageUnitName})`
					: "";
			return parent + child;
		})
		.join("");
};

//单据数量显示处理  如：242箱零6盒零5个
//先找default为true的，再取下级
export const getZeroUnit = data => {
	const unitData = data || [];
	const defaultItem = unitData.find(item => item.default);
	const defaultLevel = defaultItem.level;
	const defaultUnit = defaultItem.realQtyPcs
		? `${defaultItem.realQtyPcs}${defaultItem.packageUnitName}`
		: "";
	let secondUnit = "",
		thirdUnit = "";
	unitData.forEach(item => {
		const level = item.level;
		const packageUnitName = item.packageUnitName;
		const realQtyPcs = item.realQtyPcs;
		if (realQtyPcs && level === defaultLevel - 1) {
			secondUnit = `${
				defaultUnit ? localeMessage("utils.zero") : ""
			}${realQtyPcs}${packageUnitName}`;
		}
		if (realQtyPcs && level === defaultLevel - 2) {
			thirdUnit = `${
				defaultUnit ? localeMessage("utils.zero") : ""
			}${realQtyPcs}${packageUnitName}`;
		}
	});
	return defaultUnit + secondUnit + thirdUnit;
};

/**
 * YYYY-MM
 * 获取开始 结束 日期
 */
export const getMonthRange = date => {
	if (!date) return [date + "-01", date + "-31"];
	const temp = date.split("-");
	if (temp.length < 2) return [date + "-01", date + "-31"];
	const year = temp[0];
	const month = temp[1];
	const day = new Date(year, month, 0);
	const daycount = day.getDate();
	return [date + "-01", date + "-" + daycount];
};

/**
 * 千分位显示
 */
export const formatThousandth = value => {
	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * 取消千分位
 */
export const parserThousandth = value => {
	return String(value).replace(/\$\s?|(,*)/g, "");
};

export const ElementTypeEnum = {
	MUSIC: 0,
	IMAGE: 1,
	TEXT: 2,
	EGG: 3,
	BUTTON: 4,
	BOX: 5,
	CARD: 6,
	TURNTABLE: 7,
	ScratchCard: 8,
	SIGNTEXT: 9, //单样式 文字
	SWIPER: 10 //轮播图片
};

export const ActivityTypeEnum = {
	yyy: 1,
	zjd: 2,
	// lhj: 5,
	dzp: 5,
	ggk: 6,
	zlkj: 8,
	fp: 3, //翻牌
	kbx: 4, //开宝箱
	tp: 9 //投票
};

export const renderH5UrlByActivityType = ({ id, type }) => {
	return H5URL + `/activity?id=${id}&type=${type}`;
};

export const renderQrCodeByActivityType = ({ id, type, size = 128 }) => {
	let url = renderH5UrlByActivityType({ id, type });
	return <QRCode value={url} size={size} />;
};

export const calcRewardDate = (reward, formatter = "YYYY-MM-DD") => {
	let startDate, endDate;
	if (!reward.prizeExchangeRuleDTO) return { startDate, endDate };
	if (reward.prizeExchangeRuleDTO.timeLimitType === 1) {
		startDate = moment(reward.prizeExchangeRuleDTO.startTime).format(
			formatter
		);
		endDate = moment(reward.prizeExchangeRuleDTO.endTime).format(formatter);
	} else {
		let shelfLifeUnitName;
		switch (reward.prizeExchangeRuleDTO.shelfLifeUnit) {
			case 1:
				shelfLifeUnitName = "years";
				break;
			case 2:
				shelfLifeUnitName = "months";
				break;
			default:
				shelfLifeUnitName = "days";
				break;
		}
		startDate = moment()
			.add(reward.prizeExchangeRuleDTO.delayDays, "days")
			.format(formatter);
		endDate = moment()
			.add(reward.prizeExchangeRuleDTO.shelfLife, shelfLifeUnitName)
			.format(formatter);
	}

	return { startDate, endDate };
};

export const formatTraceTemplateData = data => {
	try {
		if (typeof data === "number" || typeof data === "boolean") {
			return data;
		} else if (Array.isArray(data)) {
			return data.map(obj => formatTraceTemplateData(obj));
		} else if (typeof data === "string") {
			return formatTraceTemplateData(JSON.parse(data));
		} else {
			Object.keys(data).forEach(
				key => (data[key] = formatTraceTemplateData(data[key]))
			);
			return data;
		}
	} catch (e) {
		return data;
	}
};

export const isObjectValueEqual = (a, b) => {
	return JSON.stringify(a) === JSON.stringify(b);
};

export const plus = (a, b) => {
	let x = new Big(a);
	return Number(x.plus(b));
};

export const renderCodeTypeIcon = type => {
	if (type === 0) {
		return <Icon type="scan" />;
	} else if (type === 1) {
		return <Icon type="edit" />;
	} else {
		return "";
	}
};

// 渲染表格内完工信息
export const renderTableCompleteInfo = ({
	assignQty,
	damageQty,
	recycleQty,
	scrapQty,
	productPackageDTOList
}) => {
	const packageList = productPackageDTOList || [];
	let result = "";
	result +=
		assignQty > 0
			? `${localeMessage("productCoding.list.finished")}: ${assignQty}${
					packageList.length > 1
						? `(${getProductNumberByUnitRatio(
								assignQty,
								packageList
						  )})`
						: ""
			  }; `
			: "";
	result +=
		damageQty > 0
			? `${localeMessage(
					"productCoding.list.damaged"
			  )}: ${getNumberUnitByLevel(damageQty, packageList)}; `
			: "";
	result +=
		recycleQty > 0
			? `${localeMessage(
					"productCoding.list.recovery"
			  )}: ${getNumberUnitByLevel(recycleQty, packageList)}; `
			: "";
	result +=
		scrapQty > 0
			? `${localeMessage(
					"productCoding.list.Scrap"
			  )}: ${scrapQty}${localeMessage("productCoding.config.gag")}; `
			: "";
	return result;
};
export const changeSweepCode = (datalist, obj) => {
	for (let i = 0; i < datalist.length; i++) {
		datalist[i].levelName = obj[datalist[i].level].packageUnitName;
		if (datalist[i].childList) {
			changeSweepCode(datalist[i].childList, obj);
		}
	}
};

export const renderNewCompleteInfo = ({
	displayAssignQty,
	displayDamageQty,
	displayRecycleQty,
	displayScrapQty
}) => {
	let result = "";
	result +=
		displayAssignQty !== "0"
			? `${localeMessage(
					"productCoding.list.finished"
			  )}: ${displayAssignQty}; `
			: "";
	result +=
		displayDamageQty !== "0"
			? `${localeMessage(
					"productCoding.list.damaged"
			  )}: ${displayDamageQty}; `
			: "";
	result +=
		displayRecycleQty !== "0"
			? `${localeMessage(
					"productCoding.list.recovery"
			  )}: ${displayRecycleQty}; `
			: "";
	result +=
		displayScrapQty !== "0"
			? `${localeMessage(
					"productCoding.list.Scrap"
			  )}: ${displayScrapQty}; `
			: "";
	return result;
};

export const getPackUnitNameByType = ({ type, name }) => {
	return type === 99 ? localeMessage("common.compose.name") : name;
};

export const formatTextShadowStyle = style => {
	const { textShadow, ...props } = style;
	const textShadowList = textShadow
		? [
				`${textShadow} -1px -1px 0px`,
				`${textShadow} 0px -1px 0px`,
				`${textShadow} 1px -1px 0px`,
				`${textShadow} 1px 0px 0px`,
				`${textShadow} 1px 1px 0px`,
				`${textShadow} 0px 1px 0px`,
				`${textShadow} -1px 1px 0px`,
				`${textShadow} -1px 0px 0px`
		  ]
		: [];
	return {
		...props,
		textShadow: textShadowList.join(",")
	};
};
const mime = (option, value) => {
	let mimeTypes = navigator.mimeTypes;
	for (let mt in mimeTypes) {
		if (mimeTypes[mt][option] === value) {
			return true;
		}
	}
	return false;
};
export const checkBrowser = () => {
	let ua = navigator.userAgent.toLocaleLowerCase();
	let browserType = null;
	if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
		browserType = "IE";
		// browserVersion = ua.match(/msie ([\d.]+)/) != null ? ua.match(/msie ([\d.]+)/)[1] : ua.match(/rv:([\d.]+)/)[1];
	} else if (ua.match(/firefox/) != null) {
		browserType = "firefox";
	} else if (ua.match(/ubrowser/) != null) {
		browserType = "UC";
	} else if (ua.match(/opera/) != null) {
		browserType = "opera";
	} else if (ua.match(/opr/) != null) {
		browserType = "opr";
	} else if (ua.match(/bidubrowser/) != null) {
		browserType = "bidubrowser";
	} else if (ua.match(/metasr/) != null) {
		browserType = "metasr";
	} else if (
		ua.match(/tencenttraveler/) != null ||
		ua.match(/qqbrowse/) != null
	) {
		browserType = "tencenttraveler";
	} else if (ua.match(/maxthon/) != null) {
		browserType = "maxthon";
	} else if (ua.match(/edge/) != null) {
		browserType = "edge";
	} else if (ua.match(/chrome/) != null) {
		let is360 = mime("type", "application/vnd.chromium.remoting-viewer");
		if (is360) {
			browserType = "360";
		} else {
			browserType = "chrome";
		}
	} else if (ua.match(/safari/) != null) {
		browserType = "Safari";
	} else if (ua.match(/other/) != null) {
		browserType = "other";
	} else if (ua.match(/lbbrowser/) != null) {
		browserType = "lbbrowser";
	}
	return browserType;
};
// 千分位显示
export const numberFormatter = value => {
	return value === null || value === undefined
		? ""
		: `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const numberParser = value => {
	return value.replace(/(,*)/g, "");
};
export const labelPriceUnits = value => {
	value = value ? String(value) : "";
	const units = {
		"2": localeMessage("genCodeOrderLabel.units.ten"),
		"3": localeMessage("genCodeOrderLabel.units.hundred"),
		"4": localeMessage("genCodeOrderLabel.units.thousand"),
		"5": localeMessage("genCodeOrderLabel.units.tenThousand"),
		"6": localeMessage("genCodeOrderLabel.units.hundredThousand"),
		"7": localeMessage("genCodeOrderLabel.units.million"),
		"8": localeMessage("genCodeOrderLabel.units.tenMillion")
	};
	return value.length > 2 ? units[value.length] : "";
};
