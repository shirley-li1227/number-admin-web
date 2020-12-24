import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { secretMobile } from '@/utils';
import { PHONE } from '@/utils/regExp';
import { localeMessage } from '@/utils';
import router from 'umi/router';

const FormItem = Form.Item;

@connect(({ profile }) => ({ profile }))
class ChangeMobileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: localeMessage('profile.sendCode'),
			count: 60,
			btnDisabled: false,
			emailCheck: false,
		};
		this.timer = null;
	}

	handleOk = () => {
		const { dispatch } = this.props;
		const { form: { validateFields } } = this.props;
		const { profile: { checkMobileState, changeMobileData } } = this.props;
		validateFields((errors, values) => {
			if (errors) {
				return;
			}
			console.log(values);
			let funName = '', params = {};
			if (checkMobileState === '1') {
				params = { checkCode: values.checkCode };
				funName = 'checkMobileCheckCode';//验证手机号
			} else if (checkMobileState === '2') {
				params = { emailCheckCode: values.emailCheckCode };
				funName = 'checkEmailCheckCode';//验证邮箱
			} else {
				params = { checkCode: values.newCheckCode };
				if (changeMobileData.emailTokenId) {
					funName = 'changeMobileByEmail';//通过邮箱验证修改手机号
				} else {
					funName = 'changeMobile';//通过手机验证修改手机号
				}
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
	sendCheckCode = (isOld) => {
		const { profile: { userInfo } } = this.props;
		const { dispatch } = this.props;
		const formData = this.props.form.getFieldsValue();
		if (isOld !== 'old' && !(/^1[3456789]\d{9}$/).test(formData.newMobile)) {
			message.error(localeMessage('common.test.mobile'));
			return;
		}
		dispatch({
			type: 'profile/sendCheckCode',
			payload: {
				cellphone: isOld === 'old' ? userInfo.mobile : formData.newMobile,
				checkMobileState: isOld === 'old' ? '1' : '3',
			},
			callback: () => {
				this.btnState();
			},
		});
	};
	sendEmailCheckCode = () => {
		const { profile: { userInfo } } = this.props;
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/sendEmailCheckCode',
			payload: {
				email: userInfo.email,
			},
			callback: () => {
				this.btnState();
			},
		});
	};
	emailCheck = () => {
		const { dispatch, profile: { userInfo } } = this.props;
		if(userInfo.emailChecked){
			dispatch({
				type: 'profile/changeParams',
				payload: {
					checkMobileState: '2',
				},
			});
			this.timer && clearInterval(this.timer);
			this.setState({
				title: localeMessage('profile.sendCode'),
				count: 60,
				btnDisabled: false,
			});
		}else{
			message.error(localeMessage('profile.changeMobile.emailChecked.message'));
		}
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
	getTip() {
		const emailCheckStr = localeMessage('profile.changeMobile.emailCheck');
		const examinationStr = localeMessage('profile.changeMobile.examination');
		const emailCheck = `<a data-id='email'>${emailCheckStr}</a>`;
		const examination = `<a data-id='examination'>${examinationStr}</a>`;
		return localeMessage('profile.changeMobile.tip', { email: emailCheck, examination: examination });
	}

	onTipClickHandler = (event) => {
		const target = event.target;
		if (target.dataset.id === 'email') {
			this.emailCheck();
		} else if (target.dataset.id === 'examination') {
			window.open(`${window.location.origin}${window.location.pathname}#/user/manualReview`, '_blank');
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { profile: { userInfo, checkMobileState } } = this.props;
		const { title, btnDisabled } = this.state;
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
				{checkMobileState === '1' && (
					<Form hideRequiredMark={true} style={{ height: '280px' }}>
						<div
							className={styles.changeMobileTitle}
							dangerouslySetInnerHTML={{ __html: this.getTip() }}
							onClick={this.onTipClickHandler}
						></div>
						<FormItem {...formItemLayout} label={localeMessage('profile.mobileBand.label')}>
							{getFieldDecorator('mobile', {
								initialValue: secretMobile(userInfo.mobile),
							})(<Input disabled={true} />)}
						</FormItem>
						<FormItem {...formItemLayout} label={localeMessage('profile.mobileCheckCode.label')}>
							{getFieldDecorator('checkCode', {
								rules: [{
									required: true,
									message: localeMessage('profile.checkCode.required'),
								}, { whitespace: true, message: localeMessage('profile.email.whitespace') }],
							})(<Input
							/>)}
							<Button type={'primary'} disabled={btnDisabled} className={styles.editBtn}
								onClick={() => this.sendCheckCode('old')}>{title}</Button>
						</FormItem>
					</Form>
				)}
				{checkMobileState === '2' && (
					<Form hideRequiredMark={true} style={{ height: '320px', padding: '68px' }}>
						<FormItem {...formItemLayout} label={localeMessage('profile.emailBand.label')}>
							{getFieldDecorator('email', {
								initialValue: userInfo.email,
							})(<Input disabled={true} />)}
						</FormItem>
						<FormItem {...formItemLayout} label={localeMessage('profile.checkCode.label')}>
							{getFieldDecorator('emailCheckCode', {
								rules: [{
									required: true,
									message: localeMessage('profile.checkCode.required'),
								}, { whitespace: true, message: localeMessage('profile.checkCode.whitespace') }],
							})(
								<Input />)}
							<Button type={'primary'} disabled={btnDisabled} className={styles.editBtn}
								onClick={() => this.sendEmailCheckCode()}>{title}</Button>
						</FormItem>
					</Form>
				)}
				{checkMobileState === '3' && (
					<Form hideRequiredMark={true} style={{ height: '320px', padding: '68px' }}>
						<FormItem {...formItemLayout} label={localeMessage('profile.newMobile.label')}>
							{getFieldDecorator('newMobile', {
								rules: [{
									required: true,
									message: localeMessage('profile.newMobile.required'),
								}, { whitespace: true, message: localeMessage('common.test.whitespace') }, { pattern: PHONE, message: localeMessage('common.test.mobile') }],
							})(<Input />)}
						</FormItem>
						<FormItem {...formItemLayout} label={localeMessage('profile.mobileCheckCode.label')}>
							{getFieldDecorator('newCheckCode', {
								rules: [{
									required: true,
									message: localeMessage('profile.checkCode.required'),
								}, { whitespace: true, message: localeMessage('common.test.whitespace') }],
							})(
								<Input />)}
							<Button type={'primary'} disabled={btnDisabled} className={styles.editBtn}
								onClick={() => this.sendCheckCode('new')}>{title}</Button>
						</FormItem>
					</Form>
				)}
			</Modal>
		);
	}
}

const changeMobileModal = Form.create()(ChangeMobileForm);

export default changeMobileModal;
