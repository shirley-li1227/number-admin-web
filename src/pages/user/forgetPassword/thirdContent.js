import React from 'react';
import styles from './index.less';
import { Form, Input } from 'antd';

import { validatorPasswd } from '@/utils/regExp';
import {localeMessage} from '@/utils';


const FormItem = Form.Item;
class ThirdContent extends React.Component {
	render() {
		const { getFieldDecorator } = this.props.form;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
			},
		};
		return (
			<Form hideRequiredMark={true}>
				<FormItem {...formItemLayout} label={localeMessage('forgetPassword.newPassword.label')} className={styles.newPassword}>
					{getFieldDecorator('newPassword', {
						rules: [
							{ required: true, message: localeMessage('forgetPassword.newPassword.message'), whitespace: true },
							{ validator: validatorPasswd },
						],
					})(<Input type="password" />)}
				</FormItem>
				<div className={styles.inputHelp}>{localeMessage('forgetPassword.newPassword.help')}</div>
				<FormItem {...formItemLayout} label={localeMessage('forgetPassword.rePassword.label')} className={styles.newPassword}>
					{getFieldDecorator('rePassword', {
						rules: [
							{ required: true, message: localeMessage('forgetPassword.rePassword.message'), whitespace: true },
							{ validator: validatorPasswd },
						],
					})(<Input type="password" />)}
				</FormItem>
				<div className={styles.inputHelp}>{localeMessage('forgetPassword.rePassword.help')}</div>
			</Form>
		);
	}
}
const FirstForm = Form.create()(ThirdContent);
export default FirstForm;
