import Link from "umi/link";
import { localeMessage } from "@/utils";

export const filterConfig = {
	code: {
		type: "input",
		label: localeMessage("orgCustomer.code.label"),
		keyword: "code",
		sort: 1
	},
	name: {
		type: "input",
		label: localeMessage("orgCustomer.name.label"),
		keyword: "name",
		sort: 2
	},
	enabled: {
		type: "select",
		label: localeMessage("common.isEnable"),
		keyword: "isEnabled",
		hasAll: true,
		options: [
			{ value: "1", name: localeMessage("common.options.yes") },
			{ value: "0", name: localeMessage("common.options.no") }
		],
		defaultValue: "1",
		sort: 3
	},
	uscc: {
		type: "input",
		label: localeMessage("orgCustomer.uscc.label"),
		keyword: "uscc"
	},
	salesScopeRegionIds: {
		type: "treeWithButton",
		label: localeMessage("common.label.salesScopeRegionNames"),
		keyword: "treeWithButton",
		placeholder: localeMessage("common.test.selectRequired"),
		maxTagCount: 2,
		maxTagPlaceholder: "..."
	}
	// salesScopeRegionIds: {
	// 	type: 'treeSelectMultiple',
	// 	label: localeMessage('common.label.salesScopeRegionNames'),
	// 	keyword: 'salesScopeRegionIds',
	// 	placeholder: localeMessage('common.test.selectRequired'),
	// 	maxTagCount: 2,
	// 	maxTagPlaceholder: '...'
	// },
	// isSalesScopeOverseas: {
	// 	type: 'select',
	// 	label: '是否海外查询',
	// 	keyword: 'isSalesScopeOverseas',
	// 	options: [
	// 		{ value: '1', name: localeMessage('common.options.yes') },
	// 		{ value: '0', name: localeMessage('common.options.no') }
	// 	],
	// 	defaultValue: '0',
	// }
};

export const tableColumns = {
	code: {
		title: "门店代码",
		dataIndex: "code",
		key: "code",
		sort: 1
	},
	name: {
		title: "门店名称",
		dataIndex: "name",
		key: "name",
		sort: 2
	}
};
