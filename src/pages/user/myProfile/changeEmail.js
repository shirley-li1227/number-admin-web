import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { secretMobile } from '@/utils';
import { EMAIL } from '@/utils/regExp';
import { localeMessage } from '@/utils';

const FormItem = Form.Item;

@connect(({ profile }) => ({ profile }))
class ChangeEmailForm extends React.Component {
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
		const { profile: { checkEmailState } } = this.props;
		validateFields((errors, values) => {
			if (errors) {
				return;
			}
			console.log(values);
			let funName = '', params = {};
			if (checkEmailState === '1') {
				params = { checkCode: values.checkCode, isChangeEmail: true };
				funName = 'checkMobileCheckCode';//验证手机号
			} else if (checkEmailState === '2') {
				params = { ...values };
				funName = 'changeEmailByMobile';//绑定邮箱
			}
			dispatch({
				type: `profile/${funName}`,
				payload: params,
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
	sendCheckCode = () => {
		const { profile: { userInfo } } = this.props;
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/sendCheckCode',
			payload: {
				cellphone: userInfo.mobile,
				checkEmailState: '1'
			},
			callback: () => {
				this.btnState();
			},
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
			type: 'profile/sendEmailCheckCode',
			payload: {
				email: formData.email,
				isChangeEmail: true
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
		const { profile: { userInfo, checkEmailState } } = this.props;
		const { title, btnDisabled } = this.state;
		const modalOpts = {
			...this.props,
			onOk: this.handleOk,
			okText: checkEmailState === '1' ? localeMessage('common.next') : localeMessage('common.sure')
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
				{checkEmailState === '1' && (
					<Form hideRequiredMark={true} style={{ height: '320px', padding: '68px' }}>
						<FormItem {...formItemLayout} label={localeMessage('profile.mobileBand.label')}>
							{getFieldDecorator('mobile', {
								initialValue: secretMobile(userInfo.mobile),
							})(<Input disabled={true} />)}
						</FormItem>
						<FormItem {...formItemLayout} label={localeMessage('profile.mobileCheckCode.label')}>
							{getFieldDecorator('checkCode', { rules: [{ required: true, message: localeMessage('profile.checkCode.required') }, { whitespace: true, message: localeMessage('common.test.whitespace') }] })(<Input
							/>)}
							<Button type={'primary'} disabled={btnDisabled} className={styles.editBtn}
								onClick={() => this.sendCheckCode('old')}>{title}</Button>
						</FormItem>
					</Form>
				)}
				{checkEmailState === '2' && (
					<Form hideRequiredMark={true} style={{ height: '320px', padding: '68px' }}>
						<FormItem {...formItemLayout} label={localeMessage('profile.emailBand.label')}>
							{getFieldDecorator('email', { rules: [{ required: true, message: localeMessage('profile.email.required') }, { whitespace: true, message: localeMessage('common.test.whitespace') }, { pattern: EMAIL, message: localeMessage('common.test.email') }] })(<Input />)}
						</FormItem>
						<FormItem {...formItemLayout} label={localeMessage('profile.checkCode.label')}>
							{getFieldDecorator('emailCheckCode', { rules: [{ required: true, message: localeMessage('profile.checkCode.required') }, { whitespace: true, message: localeMessage('common.test.whitespace') }] })(
								<Input />)}
							<Button type={'primary'} disabled={btnDisabled} className={styles.editBtn}
								onClick={() => this.sendEmailCheckCode()}>{title}</Button>
						</FormItem>
					</Form>
				)}
			</Modal>
		);
	}
}

const ChangeEmailModal = Form.create()(ChangeEmailForm);

export default ChangeEmailModal;
