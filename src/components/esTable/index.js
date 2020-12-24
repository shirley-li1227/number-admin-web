import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { isMatchAuth } from '@/utils/authority';

// components
import { Table, Switch, Tooltip, Icon, Button, Menu, Dropdown, Checkbox, message } from 'antd';
import ESIcon from '../esIcon';

import styles from './index.less';
import { localeMessage } from '@/utils';

@connect(({ app }) => ({
	app
}))
class ESTable extends React.PureComponent {
	getTitle = (title) => {
		if (!title) return null;
		return (
			<div className="es-title">
				{title}
			</div>
		);
	};

	getButton = (btns) => {
		const { app: { authList } } = this.props;
		if (btns.length === 0) return null;

		const renderBtn = (btn, index) => {
			const { type, label, auth, isShow, ...btnProps } = btn;
			if (!isMatchAuth(auth, authList)) return null;
			let show=isShow?isShow():true;
			if(!show)return null;
			let result;
			switch (type) {
				case 'checkbox':
					btnProps.checked = (btnProps.checked === 'true' || btnProps.checked === true) ? true : false;
					result = (
						<Checkbox key={index} {...btnProps}>{label}</Checkbox>
					);
					break;
				case 'a':
					result=(<a key={index} {...btnProps}>{label}</a>);
					break;
				default:
					result = (
						<Button
							type="primary"
							key={index}
							style={{ marginRight: 10 }}
							{...btnProps}
						>
							{label}
						</Button>
					);
			}

			return result;

		};

		return (
			<div style={{ paddingTop: 12 }}>
				{
					btns.map((btn, index) => renderBtn(btn, index))
				}
			</div>
		);
	};

	getMenuItem = (record) => {
		const { control, app: { authList } } = this.props;
		return control.map((item) => {
			let isShow = true;
			if (item.isShow) {
				isShow = item.isShow(record);
			}
			if (!isShow) {
				return null;
			}
			let isDisabled = false;
			if (item.isDisabled) {
				isDisabled = item.isDisabled(record);
			}
			let comp = null;
			switch (item.type) {
				case 'switch':
					comp = (
						<Switch size="small" checked={record[item.key]} checkedChildren={item.option[0]}
							unCheckedChildren={item.option[1]} onClick={() => isDisabled ? null : item.onClick(record)} />
					);
					break;
				case 'a':
					comp = <a onClick={() => isDisabled ? null : item.onClick(record)} className={styles.tableBtn}>{item.label}</a>;
					break;
				default:
					comp = null;
					break;
			}
			const isMatch = isMatchAuth(item.auth, authList);
			return isMatch ? comp : null;
		});
	};

	render() {
		const {
			serialNumber,
			pagination = {},
			dataSource,
			columns,
			control,
			controlStyle,
			defaultExpandAllRows,
			btns,
			title,
			rowKey,
			rowClassName,
			className = '',
			...props
		} = this.props;
		let newColumns = [...columns].filter(function (val) {
			return !(!val);
		});
		let data = dataSource;

		const pageSize = pagination.pageSize || 10;
		const page = pagination.current || 1;
		if (data && data.length > 0) { // 往列表数据里增加序号字段和数据
			data = data.map((item, index) => ({
				...item,
				'ES-SerialNumber': index + 1 + pageSize * (page - 1),
			}));
		}

		// 序号处理
		if (serialNumber.isShow) {
			newColumns.unshift({
				title: localeMessage('common.serialNumber'),
				dataIndex: 'ES-SerialNumber', // 序号keyword
				key: 'ES-SerialNumber',
				width: serialNumber.width || 60,
			});
		}

		if (control.length) { // 如果有控制配置，增加操作栏
			newColumns.push({
				title: localeMessage('common.operation'),
				key: 'operation',
				width: controlStyle.width || 80,
				align: controlStyle.align || 'left',
				fixed: controlStyle.fixed,
				render: (text, record) => {
					const items = this.getMenuItem(record).filter(item => item);
					const overlay = items.length ?
						<Menu style={{minWidth: 80}}>
							{
								items.map((item, index) => <Menu.Item key={index} style={{ textAlign: 'center' }}>{item}</Menu.Item>)
							}
						</Menu>
						: null;

					return overlay ?
						<Dropdown overlay={overlay} placement='bottomCenter'>
							<ESIcon className={styles.btnMore} type='icon-ic_operation' />
						</Dropdown>
						: null;
				},
			});
		}

		const tableColumns = newColumns.map(item => {
			return item ? {
				...item,
				dataIndex: item.dataIndex || item.key,
				title: item.tip ?
					<span>{item.title}<Tooltip title={item.tip} arrowPointAtCenter={true} placement='topLeft'><Icon
						className={styles.tipIcon} type='question-circle' /></Tooltip></span> : item.title,
				align: item.align || 'left',
			} : null;
		});
		return (
			<div className={`${styles.container} ${className}`}>
				{
					this.getTitle(title)
				}
				{
					this.getButton(btns)
				}
				<div className={pagination ? styles.tableDiv : styles.tableDivBottom}>
					<Table
						size='middle'
						dataSource={data}
						columns={tableColumns}
						rowKey={rowKey}
						pagination={pagination ? {
							...pagination,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => localeMessage('esTable.pagination', {total}),
						} : false}
						defaultExpandAllRows={defaultExpandAllRows}
						rowClassName={rowClassName}
						{...props}
					/>
				</div>
			</div>
		);
	}
}

ESTable.defaultProps = {
	serialNumber: {
		isShow: false,
		width: 80,
	},
	dataSource: [],
	columns: [],
	control: [],
	controlStyle: {},
	btns: [],
	rowKey: 'id',
};

ESTable.propTypes = {
	dataSource: PropTypes.array,
	columns: PropTypes.array,
	pagination: PropTypes.any,
	control: PropTypes.array,
	controlStyle: PropTypes.object,
	serialNumber: PropTypes.object,
	btns: PropTypes.array,
	rowKey: PropTypes.any,
};

export default ESTable;
