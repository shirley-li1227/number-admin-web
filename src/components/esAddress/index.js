import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

//components
import { Cascader, Input } from 'antd';
import { localeMessage } from '@/utils';


class ESAddress extends React.PureComponent {
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
			region: value.region,
			address: value.address,
		};
	}

	onChangeRegion = (region) => {
		this.setState({ region });
		this.triggerChange({ region });
	}

	onChangeAddress = (e) => {
		const address = e.target.value;
		this.setState({ address });
		this.triggerChange({ address });
	}

	triggerChange = (changedValue) => {
		const { onChange } = this.props;
		onChange(Object.assign({}, this.state, changedValue));
	}

	render() {
		const { options, inline, islong } = this.props;
		const { region, address } = this.state;
		return (
			<div className={`${islong? styles.esAddressLong : styles.esAddress} ${!inline ? styles.twoLine : ''}`}>
				<Cascader
					className={styles.cascader}
					options={options}
					onChange={this.onChangeRegion}
					placeholder={localeMessage('esAddress.cascader.placeholder')}
					value={region}
				/>
				<Input
					className={styles.address}
					placeholder={localeMessage('esAddress.address.placeholder')}
					onChange={this.onChangeAddress}
					maxLength={100}
					value={address}
				/>
			</div>
		);
	}

}

ESAddress.defaultProps = {
	data: {},
	onChange: () => null,
	inline: true,
};

ESAddress.propTypes = {
	options: PropTypes.array.isRequired,
	value: PropTypes.object,
	onChange: PropTypes.func,
	inline: PropTypes.bool
};

export default ESAddress;
