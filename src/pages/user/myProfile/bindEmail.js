import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';
import {localeMessage} from '@/utils';
import styles from './index.less';
import { EMAIL } from '@/utils/regExp';

const FormItem = Form.Item;

@connect(({ profile }) => ({ profile }))
class BindEmailForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: localeMessage('profile.sendCode'),
			count: 60,
			btnDisabled: false,
		};
		this.timer = null;
	}

	handleOk = () => {
		const { dispatch } = this.props;
		const { form: { validateFields } } = this.props;
		validateFields((errors, values) => {
			if (errors) {
				return;
			}
			console.log(values);
			dispatch({
				type: 'profile/bindEmail',
				payload: {
					...values
				},
				callback: () => {
					this.timer && clearInterval(this.timer);
					this.setState({
						title: localeMessage('profile.sendCode'),
						count: 60,
						btnDisabled: false,
					});
				},
			});
		});
	};

	sendEmailCheckCode = () => {
		const { dispatch } = this.props;
		const formData = this.props.form.getFieldsValue();
		if (!(EMAIL).test(formData.email)) {
			message.error(localeMessage('profile.email.test'));
			return;
		}
		dispatch({
			type: 'profile/sendBindEmailCheckCode',
			payload: {
				email: formData.email,
			},
			callback: () => {
				this.btnState();
			},
		});
	};

	btnState = () => {
		let count = this.state.count;
		this.timer = setInterval(() => {
			if (count === 1) {
				clearInterval(this.timer);
				this.setState({
					title: localeMessage('profile.sendAgain'),
					count: 60,
					btnDisabled: false,
				});
			} else {
				this.setState({
					title: `${localeMessage('profile.sent')}（${count}）`,
					count: count--,
					btnDisabled: true,
				});
			}
		}, 1000);
	};

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { title, btnDisabled } = this.state;
		const modalOpts = {
			...this.props,
			onOk: this.handleOk,
			okText: localeMessage('common.sure')
		};
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 12 },
			},
		};
		return (
			<Modal {...modalOpts}>
				<Form hideRequiredMark={true} style={{ height: '320px', padding: '68px' }}>
					<FormItem {...formItemLayout} label={localeMessage('profile.emailBand.label')}>
						{getFieldDecorator('email', { rules: [{ required: true, message: localeMessage('profile.email.required') }, { whitespace: true, message: localeMessage('profile.email.whitespace') }, { pattern: EMAIL, message: localeMessage('common.test.email') }], initialValue: modalOpts.email })(<Input />)}
					</FormItem>
					<FormItem {...formItemLayout} label={localeMessage('profile.checkCode.label')}>
						{getFieldDecorator('checkCode', { rules: [{ required: true, message: localeMessage('profile.checkCode.required') }, { whitespace: true, message: localeMessage('profile.checkCode.whitespace') }] })(
							<Input />)}
						<Button type={'primary'} disabled={btnDisabled} className={styles.editBtn}
							onClick={() => this.sendEmailCheckCode()}>{title}</Button>
					</FormItem>
				</Form>
			</Modal>
		);
	}
}

const BindEmailModal = Form.create()(BindEmailForm);

export default BindEmailModal;
