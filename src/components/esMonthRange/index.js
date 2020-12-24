// 自定义时间返回选择空间
import React from 'react';
import PropTypes from 'prop-types';

import { getNearDate ,localeMessage} from '@/utils';

import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;
const DateFormat = 'YYYY-MM';

class ESMonthRange extends React.PureComponent {
	static getDerivedStateFromProps(nextProps) {
		if ('value' in nextProps) {
			const date = nextProps.value?nextProps.value:[];
			return {
				date,
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		this.state = {
			date:props.value||[],
		};
	}

	triggerChange = (values) => {
		const { date } = values;
		const { onChange } = this.props;
		onChange(date);
	};
	handlePanelChange = (value) => {
		const date = value.map(obj => obj.format(DateFormat));
		const state = Object.assign({}, this.state, { date });
		if (!('value' in this.props)) {
			this.setState(state);
		}
		this.triggerChange(state);
	}
	handleOpenChange=(status)=>{
		this.setState({open:status});
	}
	render() {
		const { date,open } = this.state;
		const dateValue = (date || []).map(obj => moment(obj, DateFormat));
		return (
			<div className={styles.customDateContainer}>
				<RangePicker
					dropdownClassName={styles.datePicker}
					value={dateValue}
					mode={['month','month']}
					allowClear={false}
					format={DateFormat}
					open={open}
					placeholder={[localeMessage('esMonthRange.beginMonth'),localeMessage('esMonthRange.endMonth')]}
					onPanelChange={this.handlePanelChange}
					renderExtraFooter={() => <a onClick={()=>this.handleOpenChange(false)}>{localeMessage('common.sure')}</a>}
					onOpenChange={this.handleOpenChange}
				/>
			</div>
		);
	}
}

ESMonthRange.defaultProps = {
	onChange: () => null,
};

ESMonthRange.propTypes = {
	value: PropTypes.array,
	onChange: PropTypes.func,
};

export default ESMonthRange;
