// 自定义时间返回选择空间
import React from 'react';
import PropTypes from 'prop-types';

import { getNearDate, localeMessage, getMonday, getSunday } from '@/utils';

import { DatePicker, Button } from 'antd';
import moment from 'moment';
import styles from './index.less';


const { RangePicker, WeekPicker, MonthPicker } = DatePicker;
const DateFormat = 'YYYY-MM-DD';
const MonthFormat = 'YYYY-MM';

const thisYear = new Date().getFullYear();
class ESCustomDate extends React.PureComponent {
	TypeList = [
		{
			value: 'hour',
			name: localeMessage('common.label.hour'),
			defaultDate: [moment(new Date()).format(DateFormat), moment(new Date()).format(DateFormat)],
		},
		{ value: 'day', name: localeMessage('common.label.day'), defaultDate: getNearDate(7) },
		{
			value: 'week',
			name: localeMessage('common.label.week'),
			defaultDate: [getMonday(new Date(), 7), getSunday()],
		},
		{
			value: 'month',
			name: localeMessage('common.label.month'),
			defaultDate: [`${thisYear}-01-01`, moment().format(DateFormat)],
		},
	];
	static getDerivedStateFromProps(nextProps) {
		if ('value' in nextProps) {
			const { type = 'day', date = getNearDate(7) } = nextProps.value ? JSON.parse(nextProps.value) : {};
			return {
				type,
				date,
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		const { type = 'day', date = getNearDate(7) } = props.value || {};
		this.state = {
			type,
			date,
			open: false,
		};
	}

	onClickBtn = (type) => {
		const findIndex = this.TypeList.findIndex((item) => item.value === type);
		const defaultDate = this.TypeList[findIndex].defaultDate;
		const state = Object.assign({}, this.state, { type, date: defaultDate });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
	};

	onChangeDate = (value) => {
		const { type, date } = this.state;
		const newDate = type !== 'hour' ? value.map(obj => obj.format(DateFormat)) : [moment(value).format(DateFormat), moment(value).format(DateFormat)];
		const state = Object.assign({}, this.state, { date: newDate });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
		if (type === 'month' && date[1] !== newDate[1]) {
			this.handleOpenChange(false);
		}
	};
	onChangeStartWeekPicker = (value) => {
		const monday = getMonday(value);
		const { date } = this.state;
		const state = Object.assign({}, this.state, { date: [monday, date[1]] });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
	};
	onChangeEndWeekPicker = (value) => {
		const sunday = getSunday(value);
		const { date } = this.state;
		const state = Object.assign({}, this.state, { date: [date[0], sunday] });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
	};
	onChangeStartMonthPicker = (value) => {
		const { date } = this.state;
		const state = Object.assign({}, this.state, { date: [moment(value).format(DateFormat), date[1]] });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
	};
	onChangeEndMonthPicker = (value) => {
		const { date } = this.state;
		const state = Object.assign({}, this.state, { date: [date[0], moment(value).format(DateFormat)] });
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
	handleOpenChange = (status) => {
		this.setState({ open: status });
	};

	render() {
		const { type, date, open } = this.state;
		const { id } = this.props;
		const dateValue = type !== 'hour' ? (date || []).map(obj => moment(obj, DateFormat)) : moment(date[0]);
		return (
			<div className={styles.customDateContainer} id={id}>
				{
					this.TypeList.map(obj => <Button
						onClick={() => this.onClickBtn(obj.value)} type={type === obj.value ? 'primary' : ''}
						style={{ marginRight: 10 }}
						key={obj.value} value={obj.value}>{obj.name}</Button>)
				}
				{type === 'hour' && <DatePicker
					className={styles.datePicker}
					value={dateValue}
					allowClear={false}
					getCalendarContainer={() => document.getElementById(id)}
					onChange={this.onChangeDate}
				/>}
				{type === 'day' && <RangePicker
					className={styles.datePicker}
					value={dateValue}
					allowClear={false}
					getCalendarContainer={() => document.getElementById(id)}
					onChange={this.onChangeDate}
				/>}
				{type === 'week' && <div className={styles.weekBox}>
					<WeekPicker
						className={styles.datePicker}
						value={dateValue[0]}
						style={{ marginRight: 10 }}
						getCalendarContainer={() => document.getElementById(id)}
						allowClear={false}
						onChange={this.onChangeStartWeekPicker}
					/>
					<WeekPicker
						className={styles.datePicker}
						value={dateValue[1]}
						allowClear={false}
						getCalendarContainer={() => document.getElementById(id)}
						onChange={this.onChangeEndWeekPicker}
					/>
				</div>}
				{type === 'month' &&
					// <RangePicker
					// 	className={styles.datePicker}
					// 	value={dateValue}
					// 	format={MonthFormat}
					// 	allowClear={false}
					// 	mode={['month', 'month']}
					// 	open={open}
					// 	onPanelChange={this.onChangeDate}
					// 	onOpenChange={this.handleOpenChange}
					// />
					<div className={styles.weekBox}>
						<MonthPicker
							className={styles.datePicker}
							value={dateValue[0]}
							getCalendarContainer={() => document.getElementById(id)}
							style={{ marginRight: 10 }}
							allowClear={false}
							onChange={this.onChangeStartMonthPicker}
						/>
						<MonthPicker
							className={styles.datePicker}
							value={dateValue[1]}
							getCalendarContainer={() => document.getElementById(id)}
							allowClear={false}
							onChange={this.onChangeEndMonthPicker}
						/>
					</div>}
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
