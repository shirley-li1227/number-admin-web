import React from "react";

// components
import { Modal, Tree, Icon } from "antd";
import { renderCodeTypeIcon, formatDateTime, localeMessage } from "@/utils";

import styles from "./index.less";

const { TreeNode } = Tree;
const ModalCodeRelation = ({ visible, onOk, onCancel, data, onLoadData }) => {
	const modalProps = {
		title: localeMessage("common.relation.detail"),
		visible,
		onOk,
		onCancel,
		data
	};

	const detail = data.length ? data[0] : null;

	const renderTitle = item => {
		return (
			<div className={styles.treeItem}>
				<div className={styles.codeItem}>
					<span>{item.packageUnit}</span>
					<span>{renderCodeTypeIcon(item.collectType)}</span>
					<span>{item.code}</span>
				</div>
				{item.scanTime ? (
					<div className={styles.dateItem}>
						<span>
							<Icon type="clock-circle" />
						</span>
						<span>{formatDateTime(item.scanTime)}</span>
					</div>
				) : null}
			</div>
		);
	};

	const renderTreeNodes = (list = []) => {
		return list.map(item => {
			return (
				<TreeNode
					title={renderTitle(item)}
					key={item.code}
					dataRef={item}
					isLeaf={!item.allowOpen}
				>
					{item.childs && item.childs.length
						? renderTreeNodes(item.childs)
						: null}
				</TreeNode>
			);
		});
	};

	return (
		<Modal {...modalProps}>
			{detail ? (
				<div>
					<div className={styles.codeItem}>
						<span>{detail.packageUnit}</span>
						<span>{renderCodeTypeIcon(detail.collectType)}</span>
						<span>{detail.code}</span>
					</div>
					<Tree loadData={onLoadData}>
						{renderTreeNodes(detail.childs || [])}
					</Tree>
				</div>
			) : null}
		</Modal>
	);
};

export default ModalCodeRelation;
