import React from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button, Input, Radio, Tree, Icon } from "antd";
import { localeMessage } from "@/utils";
import { connect } from "dva";

const { TreeNode } = Tree;

class SweepCode extends React.Component {
	renderTreeNodes = data =>
		data.map(item => {
			if (item.childList && item.childList.length > 0) {
				return (
					<TreeNode
						title={
							<span>
								{item.levelName}（{item.childList.length}
								{item.childList[0].levelName})
								{item.inputType == 1 ? (
									<Icon type="edit" />
								) : item.inputType == 0 ? (
									<Icon type="scan" />
								) : (
									""
								)}{" "}
								{item.code}
							</span>
						}
						key={item.code}
					>
						{this.renderTreeNodes(item.childList)}
					</TreeNode>
				);
			}
			return (
				<TreeNode
					title={
						<span>
							{item.levelName}{" "}
							{item.inputType == 1 ? (
								<Icon type="edit" />
							) : item.inputType == 0 ? (
								<Icon type="scan" />
							) : (
								""
							)}{" "}
							{item.code}
						</span>
					}
					key={item.code}
				/>
			);
		});
	render() {
		const { onCancel, visible, dataList } = this.props;

		const modalOpts = {
			visible: visible,
			title: localeMessage("allocationform.form.scanQty"),
			footer: null,
			centered: true,
			width: 600,
			height: 430,
			onCancel: onCancel
		};
		return (
			<Modal {...modalOpts}>
				<div style={{ height: "400px", overflow: "auto" }}>
					{dataList ? (
						<Tree defaultExpandAll defaultSelectedKeys={[]}>
							{this.renderTreeNodes(dataList)}
						</Tree>
					) : (
						<div />
					)}
				</div>
				<div
					style={{
						height: "30px",
						paddingTop: "10px",
						textAlign: "right"
					}}
				>
					<Button type="primary" onClick={onCancel}>
						{localeMessage("common.close")}
					</Button>
				</div>
			</Modal>
		);
	}
}

SweepCode.propTypes = {
	visible: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	dataList: PropTypes.array
};

export default SweepCode;
