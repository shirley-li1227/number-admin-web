import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { secretMobile } from '@/utils';
import { validatorPasswd } from '@/utils/regExp';
import { localeMessage } from '@/utils';

const FormItem = Form.Item;

@connect(({ changePwd }) => ({ changePwd }))
class ChangePwdForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: localeMessage('profile.sendCode'),
			count: 60,
			btnDisabled: false,
		};
		this.timer = null;
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'changePwd/getMyAccount',
		});
	}

	handleOk = () => {
		const { dispatch, changePwd: { userInfo } } = this.props;
		const { form: { validateFields } } = this.props;
		validateFields((errors, values) => {
			if (errors) {
				return;
			}
			console.log(values);
			if (values.password === values.newPassword) {
				message.error(localeMessage('profile.changePwd.samePwd'));
				return;
			}
			if (values.confirmedNewPassword !== values.newPassword) {
				message.error(localeMessage('profile.changePwd.diffPwd'));
				return;
			}
			// if (userInfo.admin) {
			// 	dispatch({
			// 		type: 'changePwd/changePasswordByMobile',
			// 		payload: {
			// 			...values,
			// 		},
			// 	});
			// } else {
			dispatch({
				type: 'changePwd/changePassword',
				payload: {
					...values,
				},
			});
			// }
		});
	};

	sendCheckCode = () => {
		const { dispatch } = this.props;
		const { userInfo } = this.props.changePwd;
		dispatch({
			type: 'changePwd/sendCheckCode',
			payload: {
				cellphone: userInfo.mobile,
			},
			callback: () => {
				this.btnState();
			},
		});
	};

	//发送按钮状态
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
		const { userInfo } = this.props.changePwd;
		const { title, btnDisabled } = this.state;
		console.log(userInfo);
		const modalOpts = {
			...this.props,
			onOk: this.handleOk,
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
				<Form hideRequiredMark={true}>
					<FormItem {...formItemLayout} label={localeMessage('profile.changePwd.password.label')}>
						{getFieldDecorator('password', {
							rules: [
								{ required: true, message: localeMessage('profile.changePwd.password.required') },
								{ validator: validatorPasswd },
							],
						})(<Input type={'password'} />)}
					</FormItem>
					<FormItem {...formItemLayout} label={localeMessage('profile.changePwd.newPassword.label')}>
						{getFieldDecorator('newPassword', {
							rules: [
								{ required: true, message: localeMessage('profile.changePwd.newPassword.required') },
								{ validator: validatorPasswd },
							],
						})(<Input type={'password'} />)}
					</FormItem>
					<FormItem {...formItemLayout} label={localeMessage('profile.changePwd.confirmedNewPassword.label')}>
						{getFieldDecorator('confirmedNewPassword', {
							rules: [
								{ required: true, message: localeMessage('profile.changePwd.confirmedNewPassword.required') },
								{ validator: validatorPasswd },
							],
						})(<Input type={'password'} />)}
					</FormItem>
					{
						userInfo.admin &&
						false &&
						<div>
							<FormItem {...formItemLayout} label={localeMessage('profile.mobileBand.label')}>
								{getFieldDecorator('mobile', {
									initialValue: secretMobile(userInfo.mobile),
								})(<Input disabled={true} />)}
							</FormItem>
							<FormItem {...formItemLayout} label={localeMessage('profile.mobileCheckCode.label')}>
								{getFieldDecorator('mobileCheckCode', {
									rules: [{
										required: true,
										message: localeMessage('profile.checkCode.required'),
									}, { whitespace: true, message: localeMessage('common.test.whitespace') }],
								})(
									<Input />)}
								<Button type="primary" disabled={btnDisabled} className={styles.editBtn}
									onClick={() => this.sendCheckCode()}>{title}</Button>
							</FormItem>
						</div>
					}
				</Form>
			</Modal>
		);
	}
}

const ChangePwd = Form.create()(ChangePwdForm);

export default ChangePwd;
