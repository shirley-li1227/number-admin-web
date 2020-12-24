import React from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import router from "umi/router";

// components
import { Modal } from "antd";
import ESFilter from "@/components/esFilter";
import ESTable from "@/components/esTable";

//
import { renderTableSwitch, localeMessage } from "@/utils";
import { filterConfig, tableColumns } from "./config";
import exportFile from "@/utils/exportFile";

const OrgCustomer = ({ location, dispatch, shop, loading }) => {
	const {
		name_space,
		pagination,
		list,

		treeList,
		worldList
	} = shop;

	const onSubmit = values => {
		router.push({
			path: location.pathname,
			query: {
				...values
			}
		});
	};

	const onEdit = record => {
		router.push({
			pathname: `${location.pathname}/edit`,
			query: {
				id: record.id
			}
		});
	};

	const onDelete = record => {
		const { id, name } = record;
		Modal.confirm({
			title: localeMessage("common.delete.confirm.name", { name }),
			onOk() {
				dispatch({
					type: `${name_space}/remove`,
					payload: id
				});
			}
		});
	};

	const onChangeHandler = ({ current, pageSize }) => {
		router.push({
			path: location.pathname,
			query: {
				...location.query,
				page: current,
				pageSize
			}
		});
	};

	filterConfig.salesScopeRegionIds.treeDataIn = treeList;
	filterConfig.salesScopeRegionIds.treeDataOut = worldList.map(obj => ({
		...obj,
		value: obj.id,
		title: obj.enName
	}));
	const forms = Object.values(filterConfig).sort((a, b) => a.sort - b.sort);
	const filterProps = {
		filter: {
			...location.query
		},
		forms,
		onSubmit: onSubmit,
		btns: []
	};

	const columns = Object.values(tableColumns).sort((a, b) => a.sort - b.sort);
	const tableProps = {
		pagination,
		dataSource: list,
		columns,
		loading: loading,
		control: [
			{
				type: "a",
				label: localeMessage("common.edit"),
				key: "edit",
				onClick: onEdit
			},
			{
				type: "a",
				label: localeMessage("common.delete"),
				key: "delete",
				onClick: onDelete
			}
		],
		btns: [
			{
				label: localeMessage("common.create"),
				onClick: () => {
					router.push({
						pathname: `${location.pathname}/create`
					});
				}
			}
		],
		onChange: onChangeHandler
	};

	return (
		<div>
			{/* <ESFilter {...filterProps} /> */}
			<ESTable {...tableProps} />
		</div>
	);
};

OrgCustomer.propTypes = {
	customer: PropTypes.object,
	location: PropTypes.object,
	dispatch: PropTypes.func,
	loading: PropTypes.bool
};

export default connect(({ shop, loading }) => ({
	shop,
	loading: loading.models["shop"]
}))(OrgCustomer);
