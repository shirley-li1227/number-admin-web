import React from 'react';
import { connect } from 'dva';
import ESForm from '@/components/esForm';
import router from 'umi/router';
import moment from 'moment';
import { localeMessage } from '@/utils';
import style from './index.less';
import { Button } from 'antd';
import { validatorPasswd } from '@/utils/regExp';
// components

@connect(({ forceChangePassword, loading }) => ({
	forceChangePassword,
	loading: loading.models['forceChangePassword'],
}))

class ForceChangePassword extends React.Component {
	goBack = () => {
		router.goBack();
	};
	onSubmitHandler = () => {
		const { getFieldsValue, validateFields } = this.formRef.props.form;
		validateFields((errors) => {
			if (errors) {
				return;
			}
			const params = getFieldsValue();
			console.log(params);
			const { dispatch } = this.props;
			dispatch({
				type: 'forceChangePassword/forceChangePassword',
				payload: {
					...params,
				},
			});
		});


	};
	saveFormRef = formRef => {
		this.formRef = formRef;
	};

	render() {
		const {
			loading,
			location,
		} = this.props;
		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'label',
							keyword: 'username',
							label: localeMessage('forceChangePassword.username'),
							value: location.query.username,
						},
						{
							type: 'password',
							keyword: 'password',
							label: localeMessage('forceChangePassword.password'),
							rules: [
								{ required: true, message: localeMessage('forceChangePassword.password.required') },
								{ validator: validatorPasswd },
							],
						}, {
							type: 'password',
							keyword: 'newPassword',
							label: localeMessage('forceChangePassword.newPassword'),
							rules: [
								{ required: true, message: localeMessage('forceChangePassword.newPassword.required') },
								{ validator: validatorPasswd },
							],
						}, {
							type: 'password',
							keyword: 'confirmedNewPassword',
							label: localeMessage('forceChangePassword.confirmedNewPassword'),
							rules: [
								{ required: true, message: localeMessage('forceChangePassword.confirmedNewPassword.required') },
								{ validator: validatorPasswd },
							],
						},
					],
				},
			],
			wrappedComponentRef: this.saveFormRef,
		};
		return (
			<div className={style.content}>
				<div className={style.title}>{localeMessage('forceChangePassword.tip')}</div>
				<div className={style.form}>
					<ESForm {...esFormConfig} />
					<Button htmlType={'submit'} type={'primary'} onClick={this.onSubmitHandler}>{localeMessage('forceChangePassword.tip')}</Button>
				</div>
			</div>
		);
	}
}

export default ForceChangePassword;
