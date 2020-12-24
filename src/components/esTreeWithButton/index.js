// 自定义城市选择
import React from 'react';
import PropTypes from 'prop-types';

import { Button, TreeSelect } from 'antd';
import styles from './index.less';
import { localeMessage } from '@/utils';
const ButtonGroup = Button.Group;



class ESTreeWithButton extends React.PureComponent {

	constructor(props) {
		super(props);
		console.log('props', props.value);
		if(props.value){
			const valueObj = JSON.parse(props.value);
			this.state = {
				isSalesScopeOverseas: valueObj.isSalesScopeOverseas,
				list: valueObj.list
			};
		} else {
			this.state = {
				isSalesScopeOverseas: '0',
				list: []
			};
		}
	}

	selectTree = (status) => {
		this.setState({ 
			isSalesScopeOverseas: status,
			list: []
		});
		const { onChange } = this.props;
		onChange(JSON.stringify({
			isSalesScopeOverseas: status,
			list: []
		}));
	}
	onChange = (data) => {
		this.setState({ list: data });
		const { onChange } = this.props;
		onChange(JSON.stringify({
			isSalesScopeOverseas: this.state.isSalesScopeOverseas,
			list: data
		}));
	}
	render() {
		const { isSalesScopeOverseas, list } = this.state;
		const { multiple, showCheckedStrategy, treeCheckable, dropdownStyle, dprops } = this.props;
		if(isSalesScopeOverseas !== '0'){
			dprops.treeData = dprops.treeDataOut;
		} else {
			dprops.treeData = dprops.treeDataIn;
		}
		console.log('dprops', isSalesScopeOverseas, isSalesScopeOverseas !== '0');
		return (
			<div style={{position: 'relative'}}>
				<TreeSelect
					multiple={multiple}
					showCheckedStrategy= {showCheckedStrategy}
					treeCheckable={treeCheckable}
					dropdownStyle={dropdownStyle}
					value={list}
					onChange={this.onChange}
					{...dprops}
				>
				</TreeSelect>
				<div style={{position: 'absolute', top: 0, right: '-140px', width: '130px'}}>
					<ButtonGroup>
						<Button type={isSalesScopeOverseas === '0'?'primary':''} onClick={() => this.selectTree('0')}>{localeMessage('orgCustomer.inChina')}</Button>
						<Button type={isSalesScopeOverseas === '1'?'primary':''} onClick={() => this.selectTree('1')} >{localeMessage('orgCustomer.outChina')}</Button>
					</ButtonGroup>
				</div>
			</div>
		);
	}
}

ESTreeWithButton.defaultProps = {
	onChange: () => null,
};

ESTreeWithButton.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default ESTreeWithButton;
