import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

// components
import { Input, Select } from 'antd';

class ESInputSelect extends React.Component {

	static getDerivedStateFromProps(nextProps) {
		// Should be a controlled component.
		if ('value' in nextProps) {
			return {
				...(nextProps.value || {}),
			};
		}
		return null;
	}

	constructor(props) {
		super(props);

		const value = props.value || {};
		this.state = {
			number: value.number || '',
			type: value.type || undefined,
		};
	}

	handlerInputChange = (e) => {
		const number = e.target.value;
		if (!('value' in this.props)) {
			this.setState({ number });
		}
		this.triggerChange({ number });
	}

	handleSelectChange = (type) => {
		if (!('value' in this.props)) {
			this.setState({ type });
		}
		this.triggerChange({ type });
	}

	triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(Object.assign({}, this.state, changedValue));
		}
	}

	render() {
		const { number, type } = this.state;
		const { options } = this.props;
		return (
			<div className={styles.esInputSelect}>
				<Input
					className={styles.numberInput}
					type="number"
					value={number}
					min="0"
					onChange={this.handlerInputChange} />
				<Select className={styles.typeSelect} value={type} onChange={this.handleSelectChange}>
					{
						options.map((obj, index) => <Select.Option key={index} value={obj.value || obj.id}>{obj.name}</Select.Option>)
					}
				</Select>
			</div>
		);
	}
}

ESInputSelect.defaultProps = {
	options: [],
};

ESInputSelect.propTypes = {
	value: PropTypes.object,
	options: PropTypes.array,
};

export default ESInputSelect;
