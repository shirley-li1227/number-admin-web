// 合作时间选择空间
import React from 'react';
import PropTypes from 'prop-types';

import { DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { localeMessage } from '@/utils';

class ESCooperationDate extends React.PureComponent {
	static getDerivedStateFromProps(nextProps) {
		if ('value' in nextProps) {
			const { longTerm, startDate, endDate } = nextProps.value || {};
			return {
				longTerm,
				startValue: startDate ? moment(startDate) : null,
				endValue: longTerm ? null : endDate ? moment(endDate) : null
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		const values = props.value || {};
		this.state = {
			longTerm: values.longTerm,
			startValue: values.startDate ? moment(values.startDate) : null,
			endValue: values.endDate ? moment(values.endDate) : null
		};
	}

	onChangeCheckbox = (e) => {
		const val = e.target.checked;
		this.triggerChange({
			...this.state,
			longTerm: val,
			endValue: val ? null : this.state.endValue,
		});
	}

	disabledStartDate = (startValue) => {
		const { endValue } = this.state;
		if (!startValue || !endValue) {
			return false;
		}
		return startValue.startOf('day') >= endValue.startOf('day');
	}

	disabledEndDate = (endValue) => {
		const { startValue } = this.state;
		if (!startValue || !endValue) {
			return false;
		}
		return endValue.startOf('day') <= startValue.startOf('day');
	}

	onChangeStartDate = (startValue) => {
		this.triggerChange({
			...this.state,
			startValue
		});
	}

	onChangeEndDate = (endValue) => {
		this.triggerChange({
			...this.state,
			endValue
		});
	}

	triggerChange = (values) => {
		const { startValue, endValue, longTerm } = values;
		const { onChange } = this.props;
		onChange({
			startDate: startValue&&startValue.format('YYYY-MM-DD'),
			endDate: endValue&&endValue.format('YYYY-MM-DD'),
			longTerm,
		});
	}

	render() {
		const { longTerm, startValue, endValue } = this.state;
		return (
			<div className={styles.operatingPeriodBeginDate}>
				<DatePicker
					className={styles.datePicker}
					disabledDate={this.disabledStartDate}
					format="YYYY-MM-DD"
					value={startValue}
					placeholder={localeMessage('common.label.startDate')}
					onChange={this.onChangeStartDate}/>
				{!longTerm ? (
					<div>
						<span className={styles.to}> {localeMessage('common.label.to')} </span>
						<DatePicker
							className={styles.datePicker}
							disabledDate={this.disabledEndDate}
							format="YYYY-MM-DD"
							value={endValue}
							placeholder={localeMessage('common.label.endDate')}
							onChange={this.onChangeEndDate}/>
					</div>
				) : null }
				<Checkbox
					className={styles.checkBox}
					checked={longTerm}
					onChange={this.onChangeCheckbox}>{localeMessage('common.label.longTerm')}</Checkbox>
			</div>
		);
	}
}

ESCooperationDate.defaultProps = {
	onChange: () => null,
};

ESCooperationDate.propTypes = {
	value: PropTypes.object,
	onChange: PropTypes.func,
};

export default ESCooperationDate;
