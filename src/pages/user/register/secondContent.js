import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Form, Input } from 'antd';
import { REALNAME, IDNUMBER } from '@/utils/regExp';
import { localeMessage } from '@/utils';

const FormItem = Form.Item;
@connect(({ register }) => ({ register }))
class SecondContent extends React.Component {

	render() {
		const { getFieldDecorator } = this.props.form;
		const { register: { secondForm } } = this.props;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		return (
			<Form className={styles.formWrapper}>
				<FormItem {...formItemLayout} className={styles.newPassword} label={localeMessage('profile.manualReview.realName.label')}>
					{getFieldDecorator('realName', { rules: [{ pattern: REALNAME, message: localeMessage('common.test.realName') }, { required: true, message: localeMessage('profile.manualReview.realName.required') }, { whitespace: true, message: localeMessage('common.test.whitespace') }], initialValue: secondForm.realName })(<Input placeholder={localeMessage('common.test.realName')} />)}
				</FormItem>
				<FormItem {...formItemLayout} className={styles.newPassword} label={localeMessage('profile.manualReview.idNumber.label')}>
					{getFieldDecorator('idNumber', { rules: [{ pattern: IDNUMBER, message: localeMessage('register.secondContent.idNumber.pattern') }, { required: true, message: localeMessage('profile.manualReview.idNumber.required') }], initialValue: secondForm.idNumber })(<Input placeholder={localeMessage('register.secondContent.idNumber.placeholder')} />)}
				</FormItem>
			</Form>
		);
	}
}

const FirstForm = Form.create()(SecondContent);

export default FirstForm;
