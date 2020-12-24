// 自定义时间返回选择空间
import React from 'react';
import PropTypes from 'prop-types';

import { getNearDate ,localeMessage} from '@/utils';

import { DatePicker, Select } from 'antd';
import moment from 'moment';
import styles from './index.less';


const { RangePicker } = DatePicker;
const Option = Select.Option;
const DateFormat = 'YYYY-MM-DD';


class ESCustomDate extends React.PureComponent {
	static getDerivedStateFromProps(nextProps) {
		if ('value' in nextProps) {
			const { type = '7', date } = nextProps.value ? JSON.parse(nextProps.value) : {};
			const defaultDate = Number(type) !== 0 ? getNearDate(Number(type)) : date;
			return {
				type,
				date: defaultDate,
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		const { type = '7', date } = props.value || {};
		const defaultDate = Number(type) !== 0 ? getNearDate(Number(type)) : date;
		this.state = {
			type,
			date: defaultDate,
		};
	}

	onSelectChange = (type) => {
		const { date } = this.state;
		const defaultDate = Number(type) !== 0 ? getNearDate(Number(type)) : date;
		const state = Object.assign({}, this.state, { type, date: defaultDate });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
	};

	onChangeDate = (value) => {
		const date = value.map(obj => obj.format(DateFormat));
		const state = Object.assign({}, this.state, { date });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
	};

	triggerChange = (values) => {
		const { type, date } = values;
		const { onChange } = this.props;
		onChange(JSON.stringify({
			type,
			date,
		}));
	};

	render() {
		const { type, date } = this.state;
		const dateValue = (date || []).map(obj => moment(obj, DateFormat));
		const disabled = Number(type) !== 0;
		const TypeList = [
			{ value: '1', name: localeMessage('esCustomDate.typeList.today') },
			{ value: '7', name: localeMessage('esCustomDate.typeList.last',{day:7}) },
			{ value: '30', name: localeMessage('esCustomDate.typeList.last',{day:30}) },
			{ value: '60', name: localeMessage('esCustomDate.typeList.last',{day:60}) },
			{ value: '0', name: localeMessage('esCustomDate.typeList.select') },
		];
		return (
			<div className={styles.customDateContainer}>
				<Select className={styles.select} value={type} onChange={this.onSelectChange}>
					{
						TypeList.map(obj => <Option key={obj.value} value={obj.value}>{obj.name}</Option>)
					}
				</Select>
				<RangePicker
					className={styles.datePicker}
					disabled={disabled}
					value={dateValue}
					onChange={this.onChangeDate}
				/>
			</div>
		);
	}
}

ESCustomDate.defaultProps = {
	onChange: () => null,
};

ESCustomDate.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default ESCustomDate;
