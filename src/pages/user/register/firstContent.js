import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { PHONE } from '@/utils/regExp';
import { Form, Input, Row, Col, Button, Checkbox } from 'antd';
import { localeMessage } from '@/utils';
import { PlatformName } from '@/const';

const FormItem = Form.Item;
@connect(({ register }) => ({ register }))
class FirstContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: localeMessage('profile.sendCode'),
			count: 60,
			btnDisabled: true,
		};
		this.timer = null;
	}
	componentDidMount() {
		const { register: { firstForm } } = this.props;
		if (!firstForm.imageCheckCode) {
			this.props.getCode();
		}
		if (firstForm.cellphone && PHONE.test(firstForm.cellphone)) {
			this.setState({
				btnDisabled: false
			});
		}
	}
	isMobileBound = (rule, value, testCallback) => {
		const { dispatch } = this.props;
		if (!value) {
			testCallback(localeMessage('profile.newMobile.required'));
			this.setState({
				btnDisabled: true
			});
		}
		if (!PHONE.test(value)) {
			testCallback(localeMessage('common.test.mobile'));
			this.setState({
				btnDisabled: true
			});
		}
		if (value && PHONE.test(value)) {
			dispatch({
				type: 'register/isMobileBound',
				payload: {
					mobile: value
				},
				callback: (data) => {
					this.setState({
						btnDisabled: data
					});
					if (data) {
						testCallback(localeMessage('register.firstContent.isMobileBound'));
					} else {
						testCallback();
					}
				}
			});
		}
	};
	getCaptcha = () => {
		const formData = this.props.form.getFieldsValue();
		const { dispatch } = this.props;
		dispatch({
			type: 'register/sendCheckCodeForRegister',
			payload: {
				...formData
			},
			callback: () => {
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
			}
		});
	};
	changeBtnState = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'register/changeBtnState',
		});
	};

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { register: { firstForm, title } } = this.props;
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
				<FormItem {...formItemLayout} className={styles.newPassword} label={localeMessage('profile.mobile.label')}>
					{getFieldDecorator('cellphone', {
						rules: [
							{ validator: this.isMobileBound }
						], initialValue: firstForm.cellphone
					})(<Input />)}
				</FormItem>
				<FormItem className={styles.newPassword}
					{...formItemLayout}
					label={localeMessage('register.imageCheckCode.label')}
				>
					<Row gutter={10}>
						<Col span={16}>
							{getFieldDecorator('imageCheckCode', {
								initialValue: firstForm.imageCheckCode, rules: [{ required: true, message: localeMessage('register.imageCheckCode.required') }],
							})(<Input />)}
						</Col>
						<Col span={8}>
							<img
								className={styles.VerificationCode}
								onClick={() => this.props.getCode()}
								src={this.props.captcha}
								alt={localeMessage('login.vcaptchaImage.alt')}
								title={localeMessage('register.imageCheckCode.imgTitle')}
							/>
						</Col>
					</Row>
				</FormItem>
				<FormItem className={styles.newPassword}
					{...formItemLayout}
					label={localeMessage('profile.mobileCheckCode.label')}
				>
					<Row gutter={10}>
						<Col span={16}>
							{getFieldDecorator('checkCode', {
								initialValue: firstForm.checkCode, rules: [{ required: true, message: localeMessage('register.checkCode.required') }],
							})(<Input />)}
						</Col>
						<Col span={8}>
							<Button type={'primary'}
								style={{ width: '100%' }}
								disabled={this.state.btnDisabled}
								loading={this.props.captchaLoading}
								onClick={this.getCaptcha}>{this.state.title}</Button>
						</Col>
					</Row>
				</FormItem>
				<FormItem className={styles.newPassword}
					colon={false}
					label={' '}
					{...formItemLayout}
				>
					{getFieldDecorator('remember', {
						valuePropName: 'checked',
						initialValue: firstForm.remember,
					})(
						<Checkbox onChange={this.changeBtnState}>{localeMessage('register.remember')}</Checkbox>,
					)}
					<a onClick={this.props.showModal} className={styles.agreeCheck}>《{localeMessage('register.agreement.title')}》</a>
					{/* <a onClick={this.props.showModal} className={styles.agreeCheck}>{localeMessage('register.protocol', { name: PlatformName })}</a> */}
				</FormItem>
			</Form >
		);
	}
}

const FirstForm = Form.create()(FirstContent);

export default FirstForm;
