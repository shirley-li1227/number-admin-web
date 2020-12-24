import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Steps } from 'antd';
import styles from './index.less';
import { localeMessage } from '@/utils';
import FirstContent from './firstContent.js';
import SecondContent from './secondContent.js';
import ThirdContent from './thirdContent.js';
import LastContent from './lastContent.js';
import UserHeader from '@/layouts/userLayout/header';
const Step = Steps.Step;

@connect(({ forgetPassword }) => ({ forgetPassword }))
class ForgetPassword extends Component {

	handleCreate = (current) => {
		const { dispatch } = this.props;
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			console.log('Received values of form: ', values);
			if (current === 0) {
				dispatch({
					type: 'forgetPassword/userCheck',
					payload: {
						...values,
					},
				});
			} else if (current === 1) {
				dispatch({
					type: 'forgetPassword/verificationIdentity',
					payload: {
						...values,
					},
				});
			} else if (current === 2) {
				dispatch({
					type: 'forgetPassword/changePwd',
					payload: {
						...values,
					},
				});
			}
		});
	};
	saveFormRef = formRef => {
		this.formRef = formRef;
	};


	getCode = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'forgetPassword/getCaptcha',
		});
	};
	//获取手机验证码
	getMobileCaptcha = () => {
		const {
			forgetPassword: { userInfo = {} },
		} = this.props;
		const { dispatch } = this.props;
		dispatch({
			type: 'forgetPassword/getMobileCaptcha',
			payload: {
				username: userInfo.username,
			},
		});
	};
	//获取邮箱验证码
	getEmailCaptcha = () => {
		const {
			forgetPassword: { userInfo = {} },
		} = this.props;
		const { dispatch } = this.props;
		dispatch({
			type: 'forgetPassword/getEmailCaptcha',
			payload: {
				username: userInfo.username,
			},
		});
	};
	goLogin = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'forgetPassword/goLogin',
		});
	};

	render() {
		const {
			forgetPassword: { current = 0, captcha = '', userInfo = {} },
		} = this.props;

		const steps = [
			{
				title: localeMessage('forgetPassword.firstStep.title'),
				content: (
					<FirstContent
						wrappedComponentRef={this.saveFormRef}
						captcha={captcha}
						getCode={this.getCode}
					/>
				),
			},
			{
				title: localeMessage('forgetPassword.secondStep.title'),
				content: (
					<SecondContent
						wrappedComponentRef={this.saveFormRef}
						userInfo={userInfo}
						getMobileCaptcha={this.getMobileCaptcha}
						getEmailCaptcha={this.getEmailCaptcha}
					/>
				),
			},
			{
				title: localeMessage('forgetPassword.thirdStep.title'),
				content: <ThirdContent
					wrappedComponentRef={this.saveFormRef}
				/>,
			},
			{
				title: localeMessage('forgetPassword.finish.title'),
				content: <LastContent />,
			},
		];
		return (
			<div className={styles.content}>
				<UserHeader title={localeMessage('forgetPassword.header')} />
				<div className={styles.stepWidth}>
					<Steps current={current}>
						{steps.map(item => (
							<Step key={item.title} title={item.title} />
						))}
					</Steps>
					<div className={styles.stepsContent}>{steps[current].content}</div>
					<div className={styles.stepsAction}>
						{current < steps.length - 1 && (
							<Button
								type="primary"

								onClick={() => this.handleCreate(current, userInfo)}
							>
								{localeMessage('forgetPassword.next')}
							</Button>
						)}
						{current === steps.length - 1 && (
							<Button
								type="primary"

								onClick={this.goLogin}
							>
								{localeMessage('forgetPassword.goBack')}
							</Button>
						)}
					</div>
				</div>
			</div>

		);
	}
}

export default ForgetPassword;
