import React from 'react';
import PropTypes from 'prop-types';

// components
import { Icon } from 'antd';

// css
import styles from './index.less';

class ESLabel extends React.PureComponent {
	render() {
		const {
			value,
			formatter,
			onClick,
			style,
		} = this.props;

		return (
			<div className={styles.container} onClick={onClick} style={style}>
				{formatter ? formatter(value) : value}
				<Icon className={styles.icon} type="right" />
			</div>
		);
	}
}

ESLabel.defaultProps = {
	formatter: () => null,
	onClick: () => null,
	style: {},
};

ESLabel.propTypes = {
	value: PropTypes.any,
	formatter: PropTypes.func,
	onClick: PropTypes.func,
	style: PropTypes.object,
};

export default ESLabel;
