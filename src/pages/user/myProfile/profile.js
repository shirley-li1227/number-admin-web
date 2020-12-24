import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import ChangeMobileModal from './changeMobile';
import ChangeEmailModal from './changeEmail';
import BindEmailModal from './bindEmail';
import { secretMobile } from '@/utils';
import { localeMessage } from '@/utils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({ profile }) => ({ profile }))
class ProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/getMyAccount',
		});
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
				type: 'profile/updateMyAccount',
				payload: {
					...values,
				},
			});
		});
	};
	changeMobileModalCancle = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/changeParams',
			payload: { changeMobileModalVisible: false },
		});
	};
	changeEmailModalCancle = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/changeParams',
			payload: { changeEmailModalVisible: false },
		});
	};
	bindEmailModalCancle = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/changeParams',
			payload: { bindEmailModalVisible: false },
		});
	};
	//修改手机
	openChangeMobileModal = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/changeParams',
			payload: { changeMobileModalVisible: true, checkMobileState: '1' },
		});
	};

	//修改邮箱
	openChangeEmailModal = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/changeParams',
			payload: { changeEmailModalVisible: true, checkEmailState: '1' },
		});
	};
	bindEmail = () => {
		const formData = this.props.form.getFieldsValue();
		this.setState({
			email: formData.email,
		});
		console.log(formData.email);
		const { dispatch } = this.props;
		dispatch({
			type: 'profile/changeParams',
			payload: { bindEmailModalVisible: true },
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { email } = this.state;
		const { profile: { userInfo, changeMobileModalVisible, changeEmailModalVisible, bindEmailModalVisible } } = this.props;
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
		const changeMobileModalOptions = {
			visible: changeMobileModalVisible,
			title: localeMessage('profile.changeMobileModal.title'),
			onCancel: this.changeMobileModalCancle,
			okText: localeMessage('common.sure'),
			cancelText: localeMessage('common.cancel'),
			centered: true,
			width: 600,
			height: 530,
			mask: false,
			destroyOnClose: true,
		};
		const changeEmailModalOptions = {
			visible: changeEmailModalVisible,
			title: localeMessage('profile.changeEmailModal.title'),
			onCancel: this.changeEmailModalCancle,
			cancelText: localeMessage('common.cancel'),
			centered: true,
			width: 600,
			height: 530,
			mask: false,
			destroyOnClose: true,
		};
		const bindEmailModalOptions = {
			visible: bindEmailModalVisible,
			title: localeMessage('profile.bindEmailModal.title'),
			onCancel: this.bindEmailModalCancle,
			cancelText: localeMessage('common.cancel'),
			centered: true,
			width: 600,
			height: 530,
			mask: false,
			destroyOnClose: true,
		};
		let emailContent;
		if (userInfo.admin) {
			if (userInfo.emailChecked) {
				emailContent = (<a className={styles.editText} onClick={this.openChangeEmailModal}>{localeMessage('profile.emailContent.modify')}</a>);
			} else {
				emailContent = (<a className={styles.editText} onClick={this.bindEmail}>{localeMessage('profile.emailContent.band')}</a>);
			}
		}
		return (
			<Modal {...modalOpts}>
				<Form hideRequiredMark={true}>
					<FormItem {...formItemLayout} label={localeMessage('profile.username.label')}>
						{getFieldDecorator('username', {
							initialValue: userInfo.username,
						})(<Input disabled={true} />)}
					</FormItem>
					<FormItem {...formItemLayout} label={localeMessage('profile.mobile.label')}>
						{getFieldDecorator('mobile', {
							initialValue: userInfo.admin ? secretMobile(userInfo.mobile) : userInfo.mobile,
						})(<Input disabled={userInfo.admin} />)}
						{userInfo.admin && (
							<a className={styles.editText} onClick={this.openChangeMobileModal}>{localeMessage('profile.emailContent.modify')}</a>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label={localeMessage('profile.realName.label')}>
						{getFieldDecorator('realName', {
							rules: [{ required: true, message: localeMessage('profile.realName.required') }, { max: 20, message: localeMessage('profile.manualReview.realName.pattern') }],
							initialValue: userInfo.realName,
						})(<Input />)}
					</FormItem>
					<FormItem {...formItemLayout} label={localeMessage('profile.gender.label')}>
						{getFieldDecorator('gender', {
							initialValue: userInfo.gender,
						})(<RadioGroup>
							<Radio value={1}>{localeMessage('profile.gender.male')}</Radio>
							<Radio value={0}>{localeMessage('profile.gender.female')}</Radio>
						</RadioGroup>)}
					</FormItem>
					<FormItem {...formItemLayout} label={localeMessage('profile.email.label')}>
						{getFieldDecorator('email', {
							initialValue: userInfo.email || '',
						})(<Input disabled={userInfo.emailChecked} />)}
						{emailContent}
					</FormItem>
				</Form>
				{changeMobileModalVisible && (<ChangeMobileModal {...changeMobileModalOptions} />)}
				{changeEmailModalVisible && (<ChangeEmailModal {...changeEmailModalOptions} />)}
				{bindEmailModalVisible && (<BindEmailModal {...bindEmailModalOptions} email={email} />)}
			</Modal>
		);
	}
}

const ProfileModal = Form.create()(ProfileForm);

export default ProfileModal;
