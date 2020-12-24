import React from 'react';
import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { Menu, Icon, Dropdown } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class SelectLang extends React.PureComponent {
	changeLang = ({ key }) => {
		setLocale(key);
	};

	render() {
		const { className } = this.props;
		const selectedLang = getLocale();
		const langMenu = (
			<Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
				<Menu.Item key="zh-CN">简体中文</Menu.Item>
				<Menu.Item key="en-US">English</Menu.Item>
			</Menu>
		);
		return (
			<Dropdown overlay={langMenu} placement="bottomRight">
				<Icon
					type="global"
					className={classNames(styles.dropDown, className)}
					title={formatMessage({ id: 'common.navBar.lang' })}
				/>
			</Dropdown>
		);
	}
}
