import React from 'react';
import styles from './index.less';
import {localeMessage} from '@/utils';
import { Form, Select, Input, Button, Row, Col, message } from 'antd';
import router from 'umi/router'
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

class SecondContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isMobileChecked: 'Mobile',
			content: {
				Mobile: {
					title: localeMessage('forgetPassword.mobile.tip'),
					count: 60,
					btnDisabled: false,
				},
				Email: {
					title: localeMessage('forgetPassword.email.tip'),
					count: 60,
					btnDisabled: false,
				},
			},
		};
		this.timer = {
			Mobile: null,
			Email: null,
		};
	}

	handleSelectChange = value => {
		this.setState({
			isMobileChecked: value,
			sendBtnTitle: value==='Mobile'?localeMessage('forgetPassword.mobile.tip'):localeMessage('forgetPassword.email.tip'),
		});
	};
	getCaptcha = () => {
		const isMobileChecked = this.state.isMobileChecked;
		if (isMobileChecked === 'Mobile') {
			if (this.props.userInfo.mobileChecked) {
				this.props.getMobileCaptcha();
			} else {
				message.warning(localeMessage('forgetPassword.mobile.warning'));
				return;
			}
		}
		if (isMobileChecked !== 'Mobile') {
			if (this.props.userInfo.emailChecked) {
				this.props.getEmailCaptcha();
			} else {
				message.warning(localeMessage('forgetPassword.email.warning'));
				return;
			}
		}
		let count = this.state.content[isMobileChecked].count;
		let content = this.state.content;
		this.timer[isMobileChecked] = setInterval(() => {
			if (count === 1) {
				clearInterval(this.timer[isMobileChecked]);
				content[isMobileChecked] = {
					title: localeMessage('forgetPassword.sendAgain'),
					count: 60,
					btnDisabled: false,
				};
				this.setState({
					content: content,
				});
			} else {
				content[isMobileChecked] = {
					title: `${localeMessage('forgetPassword.sent')}（${count}）`,
					count: count--,
					btnDisabled: true,
				};
				this.setState({
					content: content,
				});
			}
		}, 1000);

	};
	changeMobile = () => {
		router.replace({ pathname: '/user/manualReview' });
	};

	componentWillUnmount() {
		this.timer['Mobile'] && clearInterval(this.timer['Mobile']);
		this.timer['Email'] && clearInterval(this.timer['Email']);
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

		const formData = this.props.userInfo;
		const isMobileChecked = this.state.isMobileChecked;

		return (
			<Form hideRequiredMark={true}>
				<FormItem {...formItemLayout} label={localeMessage('forgetPassword.verification.label')}>
					<Select

						onChange={this.handleSelectChange}
						defaultValue={isMobileChecked}
					>
						<OptGroup label={localeMessage('forgetPassword.selectVerification')}>
							<Option value="Mobile">{localeMessage('forgetPassword.mobile.verification')}</Option>
							<Option value="Email">{localeMessage('forgetPassword.email.verification')}</Option>
						</OptGroup>
					</Select>
				</FormItem>
				<FormItem {...formItemLayout} label={localeMessage('forgetPassword.username.label')}>
					<span>{formData.username}</span>
				</FormItem>
				<FormItem
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					label={isMobileChecked === 'Mobile' ? localeMessage('forgetPassword.mobile.verification') : localeMessage('forgetPassword.email.verification')}
				>
					<span>{isMobileChecked === 'Mobile' ? (formData.mobileChecked ? formData.mobile : localeMessage('forgetPassword.none')) : (formData.emailChecked ? formData.email : localeMessage('forgetPassword.none'))}</span>
					{isMobileChecked === 'Mobile' && (
						<a className={styles.tips} onClick={this.changeMobile}>
							{localeMessage('forgetPassword.changeMobile.tip')}
						</a>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label={`${isMobileChecked === 'Mobile' ? localeMessage('forgetPassword.mobile.label') : localeMessage('forgetPassword.email.label')}`}
				>
					<Row gutter={8}>
						<Col span={13}>
							{getFieldDecorator('checkCode', {
								rules: [{ required: true, message: localeMessage('forgetPassword.checkCode.message') }],
							})(<Input/>)}
						</Col>
						<Col span={8}>
							<Button type={'primary'}
									disabled={this.state.content[isMobileChecked].btnDisabled}
									onClick={this.getCaptcha}>{this.state.content[isMobileChecked].title}</Button>
						</Col>
					</Row>
				</FormItem>
			</Form>
		);
	}
}

const FirstForm = Form.create()(SecondContent);

export default FirstForm;
