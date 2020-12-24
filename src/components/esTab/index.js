/**
 * 通用Tab栏
 * created by zhao at 2018/11/23
 */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

// components
import { Tooltip, Icon } from 'antd';


class ESTab extends React.Component {
	state = {
		selectWidth: 0,
		left: 0,
	}

	componentDidMount() {
		this.resizeSelectWidth();
		window.addEventListener('resize', this.resizeSelectWidth);

	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeSelectWidth);
	}

	resizeSelectWidth = () => {
		const w = this.getItemWidth();
		const l = this.getItemLeft();
		if (w !== this.state.selectWidth || l !== this.state.left) {
			this.setState({ selectWidth: w, left: l });
		}
	}

	getItemWidth = () => {
		const { data, activeKey } = this.props;
		const key = activeKey || data[0].key;
		const idx = data.findIndex(obj => obj.key === key);
		const items = this.refs.tabList.getElementsByClassName('item');
		if (items.length >= idx && idx >= 0) {
			return items[idx].offsetWidth;
		}
		return 0;
	}

	getItemLeft = () => {
		const { data, activeKey } = this.props;
		const key = activeKey || data[0].key;
		const idx = data.findIndex(obj => obj.key === key);
		const items = this.refs.tabList.getElementsByClassName('item') || [];
		let left = 0;
		for (let i = 0; i < items.length; i++) {
			if (idx > i) {
				left += items[i].offsetWidth;
			} else {
				break;
			}
		}

		return left;
	}

	componentDidUpdate() {
		this.resizeSelectWidth();
	}

	onClickHandler = (key) => {
		const { onChange } = this.props;
		onChange(key);
	}

	render() {
		const { selectWidth, left } = this.state;
		const { data, activeKey } = this.props;
		const key = activeKey || data[0].key;
		const idx = data.findIndex(obj => obj.key === key);
		const current = data[idx];
		const component = current ? current.component : null;
		return (
			<div>
				<div className={styles.tabHeaderContainer}>
					<div className={styles.tabHeader}>
						<div className={styles.tabList} ref="tabList">
							{
								data.map((obj, index) =>
									<div
										className={`item ${styles.tabItem} ${obj.key === key ? styles.actived : ''}`}
										key={index}
										onClick={() => this.onClickHandler(obj.key)}
									>
										{obj.title}
										{
											obj.tips ?
												<Tooltip title={obj.tips} arrowPointAtCenter={true} placement='topLeft'><Icon type='question-circle' style={{ marginLeft: 5 }} /></Tooltip>
												: null
										}
									</div>
								)
							}
						</div>

						<div className={styles.headerSelectBar} style={{ left: left, width: selectWidth }}></div>
					</div>
				</div>
				<div>{component}</div>
			</div>
		);
	}
}

ESTab.defaultProps = {
	onChange: () => null
};

ESTab.propTypes = {
	data: PropTypes.array.isRequired,
	activeKey: PropTypes.string,
	onChange: PropTypes.func,
};

export default ESTab;
