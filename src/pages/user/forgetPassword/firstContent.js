import React from 'react';
import styles from './index.less';

import { Form, Input, Row, Col } from 'antd';
import {localeMessage} from '@/utils';

const FormItem = Form.Item;

class FirstContent extends React.Component {
	componentDidMount() {
		this.props.getCode();
	}
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
				<FormItem {...formItemLayout} label={localeMessage('forgetPassword.username.label')}>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: localeMessage('forgetPassword.username.required'), whitespace: true }],
					})(<Input />)}
				</FormItem>
				<FormItem {...formItemLayout} label={localeMessage('forgetPassword.imageCheckCode.label')}>
					<Row>
						<Col span={16}>
							{getFieldDecorator('imageCheckCode', {
								rules: [{ required: true, message: localeMessage('forgetPassword.imageCheckCode.required') }],
							})(<Input />)}
						</Col>
						<Col span={8}>
							<img
								className={styles.VerificationCode}
								onClick={() => this.props.getCode()}
								src={this.props.captcha}
								alt={localeMessage('forgetPassword.captcha.alt')}
								title={localeMessage('forgetPassword.captcha.title')}
							/>
						</Col>
					</Row>
				</FormItem>
			</Form>
		);
	}
}

const FirstForm = Form.create()(FirstContent);

export default FirstForm;
