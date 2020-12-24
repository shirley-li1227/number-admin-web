import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

// components
import { Input, Select } from 'antd';

class ESSelectInput extends React.Component {

	constructor(props) {
		super(props);

		const value = props.value || '';
		this.state = {
			value
		};
	}

	static getDerivedStateFromProps(nextProps) {
		// Should be a controlled component.
		if ('value' in nextProps) {
			return {
				value: nextProps.value || '',
			};
		}
		return null;
	}

	handlerInputChange = (e) => {
		const value = Number(e.target.value);
		if (isNaN(value)) return;
		if (value < 0 || value > 96) return;

		if (!('value' in this.props)) {
			this.setState({ value });
		}
		this.triggerChange(Number(value));
	}

	handleSelectChange = (value) => {
		if (!('value' in this.props)) {
			this.setState({ value });
		}
		this.triggerChange(value);
	}

	triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(changedValue);
		}
	}

	render() {
		const { value } = this.state;
		const { options, style } = this.props;
		return (
			<div className={styles.container} style={style}>
				<Select className={styles.select} value={value} onChange={this.handleSelectChange}>
					{
						options.map((obj, index) => <Select.Option key={index} value={obj.value || obj.id}>{obj.name}</Select.Option>)
					}
				</Select>
				<div className={styles.inputDiv}>
					<Input
						className={styles.input}
						value={value}
						onChange={this.handlerInputChange} />
				</div>
			</div>
		);
	}
}

ESSelectInput.defaultProps = {
	options: [],
	value: '',
	style: {},
};

ESSelectInput.propTypes = {
	value: PropTypes.any,
	options: PropTypes.array,
};

export default ESSelectInput;
