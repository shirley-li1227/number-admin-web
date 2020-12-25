import React from "react";
import { connect } from "dva";
import router from "umi/router";

import { Breadcrumb } from "antd";
import ESForm from "@/components/esForm";

import { formatMapRegionName, localeMessage } from "@/utils";

let checkTimer, formRef;
const OrgCustomerEdit = ({ location, dispatch, orgCustomerEdit, loading }) => {
	const {
		name_space,

		orgCustomerCode,
		detail,

		regionData,
		regionList,
		treeList,

		saleRegionIdList,
		provinceData,

		isAbroad,
		worldList
	} = orgCustomerEdit;

	const onSubmitHandler = values => {
		console.log(values);
		dispatch({
			type: `${name_space}/${detail.id ? "edit" : "add"}`,
			payload: {
				...values,
				id: detail.id,
				provinceId: values.regionId && values.regionId[0],
				cityId: values.regionId && values.regionId[1],
				districtId: values.regionId && values.regionId[2],
				salesScopeRegionIds:
					values.saleRegionId && values.saleRegionId.join(",")
			}
		});
	};

	const saveFormRef = ref => {
		formRef = ref;
	};

	const checkNameIsExisted = (rule, value, callback) => {
		if (checkTimer) {
			clearTimeout(checkTimer);
			checkTimer = null;
		}

		checkTimer = setTimeout(() => {
			if (value !== orgCustomerCode) {
				dispatch({
					type: `${name_space}/isExisted`,
					payload: {
						code: value
					},
					callback: isExisted => {
						isExisted
							? callback(localeMessage("common.test.isExisted"))
							: callback();
					}
				});
			} else {
				callback();
			}
		}, 500);
	};

	const goBack = () => {
		router.goBack();
	};

	const regionIds = [detail.provinceId, detail.cityId, detail.districtIds]
		.filter(obj => obj)
		.map(item => String(item));

	const onMapSelectHandler = (values = []) => {
		dispatch({
			type: `${name_space}/changeState`,
			payload: {
				saleRegionIdList: values
			}
		});
	};

	const onDomesticChange = e => {
		dispatch({
			type: `${name_space}/changeState`,
			payload: {
				isAbroad: e.target.value
			}
		});

		if (formRef) {
			formRef.props.form.setFieldsValue({ saleRegionId: [] });
		}
	};

	const esFormConfig = {
		formList: [
			{
				data: [
					{
						type: "input",
						keyword: "code",
						label: localeMessage("orgCustomer.code.label"),
						placeholder: localeMessage("common.test.max", {
							max: 20
						}),
						value: orgCustomerCode,
						maxLength: 20,
						rules: [
							{
								required: true,
								whitespace: true,
								message:
									localeMessage("common.test.required") +
									localeMessage("orgCustomer.code.label")
							}
						]
					},
					{
						type: "input",
						keyword: "name",
						label: localeMessage("orgCustomer.name.label"),
						placeholder: localeMessage("common.test.max", {
							max: 50
						}),
						maxLength: 50,
						rules: [
							{
								required: true,
								whitespace: true,
								message:
									localeMessage("common.test.required") +
									localeMessage("orgCustomer.name.label")
							}
						],
						value: detail.name
					},
					{
						type: "cascader",
						keyword: "regionId",
						label: localeMessage("common.label.area"),
						options: regionList,
						placeholder:
							localeMessage("common.test.selectRequired") +
							localeMessage("common.label.area"),
						value: regionIds
					},
					{
						type: "input",
						keyword: "addressInfo",
						label: localeMessage("common.label.addressInfo"),
						placeholder: localeMessage("common.test.max", {
							max: 50
						}),
						maxLength: 50,
						value: detail.addressInfo,
						rules: [
							{
								whitespace: true,
								message: localeMessage("common.test.whitespace")
							}
						]
					},
					{
						type: "textarea",
						keyword: "remark",
						label: localeMessage("common.label.remark"),
						placeholder: localeMessage("common.test.max", {
							max: 500
						}),
						maxLength: 500,
						value: detail.remark,
						rules: [
							{
								whitespace: true,
								message: localeMessage("common.test.whitespace")
							}
						]
					}
				]
			}
		],
		btns: [
			{
				label: localeMessage("common.save"),
				htmlType: "submit",
				type: "primary",
				loading: loading
			},
			{
				label: localeMessage("common.back"),
				type: "",
				onClick: goBack
			}
		],
		layout: {
			labelCol: {
				style: {
					width: 160
				}
			},
			wrapperCol: {
				style: {
					flex: 1
				}
			}
		},
		onSubmit: onSubmitHandler,
		wrappedComponentRef: saveFormRef
	};

	const mapClickHandler = data => {
		let d = data.data;
		if (d && d.regionId > 0) {
			dispatch({
				type: `${name_space}/changeState`,
				payload: {
					provinceData: d
				}
			});
		}
	};

	const getMapData = () => {
		if (isAbroad) {
			return worldList
				.filter(obj => saleRegionIdList.includes(obj.id))
				.map(obj => ({
					id: obj.id,
					name: obj.enName,
					value: 1
				}));
		} else if (provinceData) {
			const region = saleRegionIdList.find(
				id => id === provinceData.regionId
			);
			let list = [];
			if (region) {
				list = regionData
					.filter(
						obj =>
							Number(String(obj.id).substring(0, 2) + "0000") ===
							provinceData.regionId
					)
					.map(obj => obj.id);
			} else {
				list = saleRegionIdList.filter(
					id =>
						Number(String(id).substring(0, 2) + "0000") ===
						provinceData.regionId
				);
			}
			return list.map(id => {
				const city = regionData.find(obj => Number(obj.id) === id);
				return {
					regionId: id,
					name: city ? city.name : localeMessage("common.map.other"),
					value: 1
				};
			});
		} else {
			let rList = saleRegionIdList.map(id =>
				Number(String(id).substring(0, 2) + "0000")
			);
			rList = [...new Set(rList)];

			return rList.map(id => {
				const citys = saleRegionIdList
					.filter(
						rid =>
							rid !== id &&
							id === Number(String(rid).substring(0, 2) + "0000")
					)
					.map(cid => {
						const city = regionData.find(
							obj => Number(obj.id) === cid
						);
						return {
							id: cid,
							name: city
								? city.name
								: localeMessage("common.map.other")
						};
					});
				const region = regionData.find(obj => Number(obj.id) === id);
				return {
					regionId: id,
					name: region
						? formatMapRegionName(region.name)
						: localeMessage("common.map.other"),
					value: citys.length > 0 ? 0 : 1,
					citys
				};
			});
		}
	};

	const mapChartProps = {
		type: "map",
		data: getMapData(),
		map: isAbroad ? "world" : provinceData ? provinceData.name : "china",
		mapType: "map",
		height: "500px",
		lineColor: ["#fa5b00", "#ec7e00", "#eb9a44", "#e1cebb", "#e6dacd"],
		clickHandler: isAbroad
			? null
			: !provinceData
			? { click: mapClickHandler }
			: null,
		visualMap: {
			show: false,
			min: 0,
			max: 1,
			color: ["#0086ed", "#70b6d6"]
		},
		tooltip: {
			formatter: function(params) {
				if (params.data) {
					if (isAbroad) {
						return params.data.name;
					} else if (provinceData) {
						return params.data.name;
					} else {
						const citys = params.data.citys;
						if (citys.length > 0) {
							return citys.map(obj => obj.name).join(",");
						} else {
							return `${params.data.name} (${localeMessage(
								"common.options.all"
							)})`;
						}
					}
				}
			}
		}
	};

	const onMapBack = () => {
		dispatch({
			type: `${name_space}/changeState`,
			payload: {
				provinceData: null
			}
		});
	};

	const getMapBreadcrumb = () => {
		const style = {
			position: "absolute",
			top: "20px",
			left: "100px",
			zIndex: 99
		};

		return provinceData ? (
			<Breadcrumb style={style}>
				<Breadcrumb.Item
					style={{ color: "#33a3dc", cursor: "pointer" }}
					onClick={onMapBack}
				>
					{localeMessage("common.map.country")}
				</Breadcrumb.Item>
				{<Breadcrumb.Item>{provinceData.name}</Breadcrumb.Item>}
			</Breadcrumb>
		) : (
			""
		);
	};

	return (
		<div>
			<ESForm {...esFormConfig} />
			<div style={{ position: "relative", marginTop: -12 }}>
				{getMapBreadcrumb()}
			</div>
		</div>
	);
};

export default connect(({ orgCustomerEdit, loading }) => ({
	orgCustomerEdit,
	loading: loading.models["orgCustomerEdit"]
}))(OrgCustomerEdit);
