import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Steps, Modal } from 'antd';
import styles from './index.less';
import FirstContent from './firstContent.js';
import SecondContent from './secondContent.js';
import ThirdContent from './thirdContent.js';
import LastContent from './lastContent.js';
import UserHeader from '@/layouts/userLayout/header';
import { localeMessage } from '@/utils';
import { PlatformName, PrivateId, PrivateEnum } from '@/const';

const Step = Steps.Step;

@connect(({ register, loading }) => ({ register, firstLoading: loading.effects['register/checkMobileForRegister'], secondLoading: loading.effects['register/saveFormData'], thirdLoading: loading.effects['register/createUserForRegister'], captchaLoading: loading.effects['register/sendCheckCodeForRegister'] }))
class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleOk = () => {
		this.setState({
			visible: false,
		});
	};

	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};
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
					type: 'register/checkMobileForRegister',
					payload: {
						...values,
					},
				});
			} else if (current === 1) {
				dispatch({
					type: 'register/saveFormData',
					payload: {
						...values,
					},
				});
			} else if (current === 2) {
				dispatch({
					type: 'register/createUserForRegister',
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
			type: 'register/getCaptcha',
		});
	};

	goLogin = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'register/goLogin',
		});
	};
	goPrev = () => {
		const { dispatch } = this.props;
		const form = this.formRef.props.form;
		const { register: { current } } = this.props;
		form.validateFields((err, values) => {
			let payload = {};
			if (current === 1) {
				payload = { secondForm: { ...values } };
			} else if (current === 2) {
				payload = { thirdForm: { ...values } };
			}
			dispatch({
				type: 'register/goPrev',
				payload: payload,
			});
		});
	};

	render() {
		const {
			register: { current = 0, captcha = '', firstForm = {}, agreement, title },
			firstLoading, secondLoading, thirdLoading, captchaLoading
		} = this.props;
		const steps = [
			{
				title: localeMessage('register.firstContent.title'),
				content: (
					<FirstContent
						wrappedComponentRef={this.saveFormRef}
						captcha={captcha}
						getCode={this.getCode}
						changeBtnState={this.changeBtnState}
						showModal={this.showModal}
						captchaLoading={captchaLoading}
					/>
				),
			},
			{
				title: localeMessage('register.secondContent.title'),
				content: (
					<SecondContent
						wrappedComponentRef={this.saveFormRef}
					/>
				),
			},
			{
				title: localeMessage('register.thirdContent.title'),
				content: <ThirdContent
					wrappedComponentRef={this.saveFormRef}
				/>,
			},
			{
				title: localeMessage('register.lastContent.title'),
				content: <LastContent
				/>,
			},
		];

		const content = PrivateId === PrivateEnum.agent_jy ? localeMessage('register.file.content.jy') : localeMessage('register.file.content');
		return (
			<div className={styles.content}>
				<UserHeader title={localeMessage('register.header.title')}>
					{current < steps.length - 1 && (
						<div className={styles.toLogin}>{localeMessage('register.hasAccount')}<a onClick={this.goLogin}>{localeMessage('register.login')}</a></div>
					)}
				</UserHeader>
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
								disabled={!firstForm.remember}
								loading={current === 0 ? firstLoading : current === 1 ? secondLoading : thirdLoading}
								onClick={() => this.handleCreate(current)}
							>
								{localeMessage('common.next')}
							</Button>
						)}
						{current !== 0 && current !== 3 && (
							<Button className={styles.stepsPrev} onClick={this.goPrev}>{localeMessage('common.previous')}</Button>
						)}
						{current === steps.length - 1 && (
							<Button
								type="primary"
								className={styles.stepsGoLogin}
								onClick={this.goLogin}
							>
								{localeMessage('register.loginAndFillInfo')}
							</Button>
						)}

					</div>
				</div>
				<Modal
					// title={localeMessage('register.protocolModal', { name: PlatformName })}
					title={title}
					centered
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText={localeMessage('common.sure')}
					cancelText={localeMessage('common.cancel')}
					width={800}
					height={530}
				>
					<div className={styles.modalBox}>
						<pre className={styles.modalContent} >
							<div dangerouslySetInnerHTML={{__html: agreement}} ></div>
						</pre>
						{/* <pre className={styles.modalContent}>{content}</pre> */}
					</div>
				</Modal>
			</div>
		);
	}
}

export default Register;
