import React from "react";
import { connect } from "dva";
import { localeMessage } from "@/utils";

//components
import { Breadcrumb } from "antd";
import DetailList from "@/components/detailList";

import { formatMapRegionName } from "@/utils";

const OrgCustomerDetail = ({
	location,
	dispatch,
	orgCustomerDetail,
	loading
}) => {
	const {
		name_space,
		detail,

		regionData,
		provinceData,
		saleRegionIdList,
		worldList
	} = orgCustomerDetail;

	const isAbroad = detail.salesScopeOverseas;
	const region = [detail.provinceName, detail.cityName, detail.districtName]
		.map(obj => obj)
		.join(" ");
	const salesNameStr = detail.salesScopeRegionNames
		? detail.salesScopeRegionNames
		: "";
	let infoProps = {
		detailsData: [
			{
				data: [
					{
						label: localeMessage("orgCustomer.code.label"),
						value: detail.code
					},
					{
						label: localeMessage("orgCustomer.name.label"),
						value: detail.name
					},
					{
						label: localeMessage("brand.label.uscc"),
						value: detail.uscc
					},
					{
						label: localeMessage("common.label.area"),
						value: region
					},
					{
						label: localeMessage("common.label.addressInfo"),
						value: detail.addressInfo
					},
					{
						label: localeMessage("common.label.remark"),
						value: detail.remark,
						alone: true
					},
					{
						label: localeMessage(
							"common.label.salesScopeRegionNames"
						),
						//value: (isAbroad ? localeMessage('orgCustomer.outChina') : localeMessage('orgCustomer.inChina')) + salesNameStr,
						value: salesNameStr,
						alone: true
					}
				]
			}
		],
		title: localeMessage("orgCustomer.detail.title")
	};
	const detailProps = {
		listData: [infoProps],
		loading: loading,
		backBtn: true
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
			<DetailList {...detailProps} />
			<div style={{ position: "relative" }}>{getMapBreadcrumb()}</div>
		</div>
	);
};

export default connect(({ orgCustomerDetail, loading }) => ({
	orgCustomerDetail,
	loading: loading.models["orgCustomerDetail"]
}))(OrgCustomerDetail);
