import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Modal, Form, Input, Button, message } from 'antd';
import styles from './index.less';
import { localeMessage } from '@/utils';

const itemLayout = {
	labelCol: {
		style: {
			width: 120
		}
	},
	wrapperCol: {
		style: {
			width: 290
		}
	}
};

@connect(({ smsVerifition }) => ({
	smsVerifition,
}))
class SMSVerifition extends React.Component {
	state = {
		time: 0
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'smsVerifition/queryApplicationMobile'
		});
	}

	componentWillUnmount() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	onSendHandler = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'smsVerifition/sendCheckCode',
			callback: () => {
				this.startTimeDown(60);
			}
		});
	}

	startTimeDown = (time) => {
		this.setState({ time });
		if (time > 0) {
			this.timer = setTimeout(() => {
				this.startTimeDown(time - 1);
			}, 1000);
		} else {
			this.timer = null;
		}
	}

	handleSubmit = () => {
		const {
			onOk,
			smsVerifition: {
				tokenId
			},
			form: {
				validateFields
			},
			dispatch,
		} = this.props;

		if (!tokenId) {
			message.error(localeMessage('modal.SMSVerifition.message.error'));
			return;
		}
		validateFields((err, values) => {
			if (err) return;
			onOk({
				captcha: values.captcha,
				tokenId,
				callback: () => {
					dispatch({
						type: 'smsVerifition/clearTokenId'
					});
				}
			});
		});
	};

	render() {
		const { time } = this.state;
		const {
			form,
			smsVerifition: {
				mobile
			},
			onCancel,
			visible,
			loading
		} = this.props;

		const { getFieldDecorator } = form;

		const modalProps = {
			title: localeMessage('modal.SMSVerifition.title'),
			visible,
			onCancel,
			width: 500,
			onOk: this.handleSubmit,
			okButtonProps: {
				loading,
			}
		};

		return (
			<Modal {...modalProps} className={styles.smsVerifition}>
				<Form>
					<Form.Item className={styles.formItem} label={localeMessage('register.firstContent.title')} {...itemLayout}>
						{
							getFieldDecorator('applicationMobile', {
								initialValue: mobile,
							})(<Input disabled />)
						}
					</Form.Item>

					<Form.Item className={styles.formItem} label={localeMessage('profile.mobileCheckCode.label')} {...itemLayout}>
						{
							getFieldDecorator('captcha', {
								rules: [
									{ required: true, message: localeMessage('profile.checkCode.required') }
								]
							})(<Input className={styles.captcha} />)
						}
						{
							time > 0
								?
								<Button className={styles.bnCaptcha} disabled>{localeMessage('forgetPassword.sent')}({time})</Button>
								:
								<Button className={styles.bnCaptcha} onClick={this.onSendHandler}>{localeMessage('profile.sendCode')}</Button>
						}

					</Form.Item>
				</Form>
			</Modal>
		);
	}
}


SMSVerifition.defaultProps = {
	onOk: () => null,
	onCancel: () => null,
};

SMSVerifition.propTypes = {
	visible: PropTypes.bool.isRequired,
	onOk: PropTypes.func,
	onCancel: PropTypes.func,
	loading: PropTypes.bool
};

export default Form.create()(SMSVerifition);
