import React from "react";
import PropTypes from "prop-types";

import { Table } from "antd";

import styles from "./style.less";

const TableItem = ({
	title,
	subData,
	blankLine,
	columns,
	detailsData,
	rowKeys
}) => {
	const bgStyle = {
		background: "#ffffff",
		marginBottom: blankLine ? 12 : 0
	};

	return (
		<div style={bgStyle}>
			{title ? (
				<div className="es-container">
					<div className="es-title" style={{ marginBottom: 0 }}>
						{title}
						{subData && (
							<span className={styles.create_time}>
								{subData.label}：{subData.value}
							</span>
						)}
					</div>
				</div>
			) : null}
			<div style={{ padding: "12px 24px" }}>
				<Table
					dataSource={detailsData}
					columns={columns}
					pagination={false}
					size="middle"
					rowKeys={rowKeys}
				/>
			</div>
		</div>
	);
};

TableItem.defaultProps = {
	detailsData: [],
	title: "",
	blankLine: true,
	rowKeys: (record, index) => String(index)
};
TableItem.propTypes = {
	columns: PropTypes.array.isRequired,
	detailsData: PropTypes.array.isRequired,
	title: PropTypes.string,
	subData: PropTypes.object,
	Layout: PropTypes.object,
	blankLine: PropTypes.bool, // 是否要空行
	rowKeys: PropTypes.func
};

export default TableItem;
