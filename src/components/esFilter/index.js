import React from 'react';
import PropTypes from 'prop-types';

import {
	Form,
	Button,
	Row,
	Col,
	Icon,
	Affix,
} from 'antd';

import { getField, localeMessage } from '@/utils';

import styles from './index.less';
import moment from 'moment';
import ESAuth from '@/components/esAuth';

const formStyle = {
	labelCol: {
		style: {
			width: 100,
			textAlign: 'right',
		},
	},
	wrapperCol: {
		style: {
			width: 'calc(100% - 100px)'
		}
	},
};

// 任一表单域的值发生改变时的回调
const onValuesChange = (props, values) => {
	for (let key in values) {
		props['filter'][key] = values[key];
	}
};

class ESFilter extends React.PureComponent {
	state = {
		expandForm: false,
	}

	toggleForm = () => {
		const { expandForm } = this.state;
		this.setState({
			expandForm: !expandForm,
		}, () => {
			const myEvent = new CustomEvent('filterHeight', {
				detail: !expandForm,
			});
			if (window.dispatchEvent) {
				window.dispatchEvent(myEvent);
			} else {
				window.fireEvent(myEvent);
			}
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { onSubmit } = this.props;
		const { validateFields } = this.props.form;
		validateFields((err, values) => {
			if (!err) {
				//过滤掉全部属性是空字符串形式的
				// let params = {}
				// for(let key in values) {
				// 	if(values[key] && values[key]!==' ') {
				// 		params[key] = values[key]
				// 	}
				// }
				onSubmit({ ...values, page: 1 });
			}
		});
	}

	handleReset = (e) => {
		const { forms, onReset } = this.props;
		const { setFieldsValue } = this.props.form;
		forms.forEach(obj => {
			const { keyword, defaultValue, type } = obj;
			let initialValue = defaultValue;
			if (type === 'datePicker') {
				initialValue = initialValue ? moment(initialValue) : initialValue;
			} else if (type === 'rangePicker') {
				initialValue = initialValue ? initialValue.map(obj => moment(obj)) : initialValue;
			}
			let fields = {};
			fields[keyword] = initialValue;
			setFieldsValue(fields);
		});

		onReset ? onReset() : this.handleSubmit(e);
	}

	getFormBtn = () => {
		const { expandForm } = this.state;
		const { forms } = this.props;
		const len = forms.length;
		const isOnly = len % 3 === 0 && expandForm;
		const colProps = {
			span: isOnly ? 24 : 8,
			// style: isOnly ? {
			// 	textAlign: 'right'
			// } : {}
			style: {
				textAlign: 'right'
			}
		};
		return (
			<Col {...colProps}>
				<div className={styles.bottonDiv}>
					<Button type='primary' htmlType='submit'>{localeMessage('common.btn.search')}</Button>
					<Button onClick={this.handleReset}>{localeMessage('common.btn.reset')}</Button>
					{
						len > 2
							? <a onClick={this.toggleForm}>{
								expandForm ? <span>{localeMessage('common.btn.up')}<Icon type='up' /></span> : <span>{localeMessage('common.btn.down')}<Icon type='down' /></span>}</a>
							: null
					}
				</div>
			</Col>
		);
	}

	getFormItems = () => {
		const { expandForm } = this.state;
		let {
			forms,
			filter,
			form: {
				getFieldDecorator
			},
		} = this.props;

		let span;

		let result = forms.map((obj, index) => {
			if (!obj.type) return null;

			// let span = 8;
			const { keyword, label, defaultValue, rules, formStyles = formStyle, colon = true, labelSpan = 8, ...props } = obj;
			let initialValue = filter[keyword] !== undefined ? filter[keyword] : defaultValue;
			span = labelSpan;
			if (props.type === 'datePicker') {
				initialValue = initialValue ? moment(initialValue) : initialValue;
			} else if (props.type === 'rangePicker') {
				initialValue = initialValue ? initialValue.map(obj => moment(obj)) : initialValue;
			} else if (props.type === 'cascader') {
				if (initialValue && !Array.isArray(initialValue)) {
					initialValue = [initialValue];
				}
			} else if (props.type === 'esCustomDate') {
				span = 16;
			}

			return (
				<Col span={span} key={index} style={{ paddingLeft: 0 }}>
					<Form.Item className={styles.filterFormItem} label={label} colon={colon} {...formStyles}>
						{
							getFieldDecorator(keyword, {
								initialValue,
								rules,
							})(getField(props, false, true))
						}
					</Form.Item>
				</Col>
			);
		});

		if (!expandForm) {
			const index = this.getSpliceIndex(forms);
			result.splice(index, result.length);
		}

		return result;
	}

	getSpliceIndex = (list) => {
		let totalSpan = 0, result = 3;

		for (let i = 0; i < list.length; i++) {
			const item = list[i];
			const { labelSpan = 8 } = item;
			totalSpan += labelSpan;
			if (totalSpan > 24) {
				result = i;
				break;
			}
		}
		return result;
	}

	getTotalSpan = () => {
		let {
			forms,
		} = this.props;
		let totalSpan = 0;
		forms.forEach(obj => {
			totalSpan += obj.labelSpan || 8;
		});
		return totalSpan;
	}

	renderFormItem = () => {
		const list = this.getFormItems();
		const totalSpan = this.getTotalSpan();

		return totalSpan < 24 ?
			<Row type="flex" gutter={24}>
				{list}
				{this.getButton({ flex: 1 })}
			</Row>
			:
			<Row type="flex">
				<Row className={styles.formItemDiv} type="flex" gutter={24}>{list}</Row>
				{this.getButton()}
			</Row>;
	}

	getButton = (style = {}) => {
		const { btns = [], onReset, onExport } = this.props;
		let resetButton = '';
		if (onReset) {
			resetButton = <Button onClick={this.handleReset}>{localeMessage('common.btn.reset')}</Button>;
		}
		let exportButton = '';
		// if(onExport) {
		// 	exportButton = <Button onClick={this.handleReset}>{localeMessage('common.btn.reset')}</Button>
		// }
		return (
			<div className={styles.buttonFromDiv} style={style}>
				<div>
					<Button key="submit" type='primary' htmlType='submit'>{localeMessage('common.btn.search')}</Button>
					{resetButton}
					{exportButton}
					{/* <Button onClick={this.handleReset}>{localeMessage('common.btn.reset')}</Button> */}
				</div>
				<div>
					{
						btns.map((btn, index) => (
							<ESAuth key={index} auth={btn.auth}>
								{
									btn.label === localeMessage('common.export') ? <div className={styles.btnExport} {...btn}>{localeMessage('common.export')}</div> : <Button {...btn}>{btn.label}</Button>
								}
							</ESAuth>
						))
					}
				</div>
			</div>
		);
	}

	renderExpand = () => {
		const { expandForm } = this.state;
		const { forms } = this.props;
		const len = forms.length;
		return len > 3
			?
			<div className={styles.expandFormDiv}>
				<div className={styles.line}></div>
				<a className={styles.expandButton} onClick={this.toggleForm}>
					{
						expandForm ? <span>{localeMessage('common.btn.up')}<Icon type='up' /></span> : <span>{localeMessage('common.btn.moreCondition')}<Icon type='down' /></span>
					}
				</a>
				<div className={styles.line}></div>
			</div>
			: null;
	}

	render() {
		const { fixed, style } = this.props;

		const main = (
			<Form className={styles.ehsureFilter} style={style} onSubmit={this.handleSubmit}>
				{
					this.renderFormItem()
				}
				{
					this.renderExpand()
				}
			</Form>
		);

		return (
			<div >
				{
					fixed
						?
						<Affix offsetTop={104}>
							{main}
						</Affix>
						: main
				}
			</div>

		);
	}
}

ESFilter.defaultProps = {
	btns: [],
	fixed: false,
};

ESFilter.propTypes = {
	forms: PropTypes.array,
	btns: PropTypes.array,
	filter: PropTypes.object,
	onSubmit: PropTypes.func,
	onReset: PropTypes.func,
	fixed: PropTypes.bool
};

export default Form.create(onValuesChange)(ESFilter);
