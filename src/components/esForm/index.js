import React from 'react';
import PropTypes from 'prop-types';
import { getField } from '@/utils';

import styles from './index.less';

// components
import ESFooterButton from '../esFooterButton';
import {
	Form,
	Row,
	Col,
	Button,
	Tooltip,
	Icon,
} from 'antd';

class ESForm extends React.Component {

	getItemLabel = (label, tips) => {
		return tips ?
			<span>{label}
				<Tooltip title={tips} arrowPointAtCenter={true} placement='topLeft'>
					<Icon className={styles.tipIcon} type='question-circle' />
				</Tooltip>
			</span> : label;
	}

	getFormItem = (data, inRow) => {
		const { layout } = this.props;
		const { getFieldDecorator } = this.props.form;
		return data.map((item, index) => {
			if (!item) return <Col key={index} className={styles.itemCol}></Col>;
			if (item instanceof Array) {
				return (
					<Row key={index} gutter={24} type='flex'>{this.getFormItem(item, true)}</Row>
				);
			} else {
				const { keyword, label, value, noStyle, tips, rules, extra, unit, ...itemProps } = item;
				const styleLayout = noStyle ? {} : { ...layout, style: { display: 'flex' } };
				const formItem = (
					<Form.Item label={this.getItemLabel(label, tips)} extra={extra} {...styleLayout} {...itemProps}>
						{
							getFieldDecorator(keyword, {
								initialValue: value !== undefined ? value : undefined,
								rules,
							})(getField(item))
						}
						{unit}
					</Form.Item>
				);
				return inRow
					?
					<Col key={`${keyword}_${index}`} className={styles.itemCol}>{formItem}</Col>
					:
					<Row key={`${keyword}_${index}`}>{formItem}</Row>;
			}
		});
	};

	getButton = (btns) => {
		if (btns.length === 0) return null;
		return (
			<ESFooterButton>
				<div className={styles.btnList}>
					{
						btns.map((btn, index) => <Button key={index} {...btn}>{btn.label}</Button>)
					}
				</div>
			</ESFooterButton>
		);
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { onSubmit } = this.props;
		const { validateFields } = this.props.form;
		validateFields((err, values) => {
			console.log(values);
			if (!err) {
				onSubmit(values);
			}
		});
	};

	renderForm = () => {
		const { formList } = this.props;
		return formList.map((form, index) => (
			<div className={styles.formContent} key={index}>
				{form.title ? <div className={styles.formTitle}>{form.title}</div> : null}
				<div>{this.getFormItem(form.data)}</div>
			</div>
		));
	}

	render() {
		const { btns } = this.props;
		return (
			<div>
				<Form className={styles.esFormDiv} onSubmit={this.handleSubmit}>
					{
						this.renderForm()
					}
					{
						this.getButton(btns)
					}
				</Form>
			</div>
		);
	}
}

ESForm.defaultProps = {
	onSubmit: () => null,
	btns: [],
	formList: [],
	layout: {
		labelCol: {
			style: {
				minWidth: 160,
			}
		},
		wrapperCol: {
			style: {
				flex: 1
			}
		},
	},
};

ESForm.propTypes = {
	onSubmit: PropTypes.func,
	formList: PropTypes.array.isRequired,
	btns: PropTypes.array,
	layout: PropTypes.object,
};

export default Form.create()(ESForm);
