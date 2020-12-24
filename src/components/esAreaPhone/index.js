
import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

//components
import { Input } from 'antd';

class ESAreaPhone extends React.PureComponent {
	static getDerivedStateFromProps(nextProps) {
		// Should be a controlled component.
		if ('value' in nextProps) {
			return {
				...(nextProps.value || ''),
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		const values = (props.value || '').split('-');
		this.state = {
			countryCode: values.length > 0 ? values[0] : '',
			phoneCode: values.length > 1 ? values[1] : '',
			extCode: values.length > 2 ? values[2] : '',
		};
	}

	onCountryChange = (e) => {
		const countryCode = e.target.value;
		this.setState({ countryCode });
		this.triggerChange({ countryCode });
	}

	onPhoneChange = (e) => {
		const phoneCode = e.target.value;
		this.setState({ phoneCode });
		this.triggerChange({ phoneCode });
	}

	onExtChange = (e) => {
		const extCode = e.target.value;
		this.setState({ extCode });
		this.triggerChange({ extCode });
	}

	triggerChange = (changedValue) => {
		const { onChange } = this.props;
		const { countryCode, phoneCode, extCode } = Object.assign({}, this.state, changedValue);
		onChange(`${countryCode}-${phoneCode}-${extCode}`);
	}

	render() {
		const { countryCode, phoneCode, extCode } = this.state;
		return (
			<div className={styles.esAreaPhone}>
				<Input
					className={styles.countryCode}
					value={countryCode}
					onChange={this.onCountryChange}
					maxLength={4}
				/>
				<span className={styles.line}>-</span>
				<Input
					className={styles.phoneCode}
					value={phoneCode}
					onChange={this.onPhoneChange}
					maxLength={8}
				/>
				<span className={styles.line}>-</span>
				<Input
					className={styles.extCode}
					value={extCode}
					onChange={this.onExtChange}
					maxLength={6}
				/>
			</div>
		);
	}
}


ESAreaPhone.defaultProps = {
	onChange: () => null,
};

ESAreaPhone.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default ESAreaPhone;
