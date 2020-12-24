import React from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import styles from './manualReview.less';
import { PHONE, IDNUMBER } from '@/utils/regExp';
import UserHeader from '@/layouts/userLayout/header';
import ESForm from '@/components/esForm';
import ESFooterButton from '@/components/esFooterButton';
import { localeMessage } from '@/utils';

@connect(({ manualReview }) => ({ manualReview }))
class ManualReview extends React.Component {
	onSubmitHandler = (values) => {
		console.log(values);
		const { dispatch } = this.props;
		dispatch({
			type: 'manualReview/retrievePwdArtificialReview',
			payload: {
				...values,
			},
		});
	};
	closeSelf = () => {
		if (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('Chrome') != -1) {
			window.location.href = 'about:blank';
			window.close();
		} else {
			window.opener = null;
			window.open('', '_self');
			window.close();
		}
	};
	submit = () => {
		const { dispatch } = this.props;
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			console.log('Received values of form: ', values);
			dispatch({
				type: 'manualReview/retrievePwdArtificialReview',
				payload: {
					...values,
				},
			});
		});
	};
	saveFormRef = formRef => {
		this.formRef = formRef;
	};

	render() {
		const {
			manualReviewInfo: {
				companyName,
				description,
				idNumber,
				licenseCopyUrl,
				newMobile,
				oldMobile,
				realName,
			},
			submitState,
		} = this.props.manualReview;
		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'input',
							keyword: 'newMobile',
							label: localeMessage('profile.manualReview.newMobile.label'),
							value: newMobile,
							rules: [
								{ required: true, message: localeMessage('profile.manualReview.newMobile.required') },
								{ pattern: PHONE, message: localeMessage('common.test.mobile') },
							],
						},
						{
							type: 'input',
							keyword: 'oldMobile',
							label: localeMessage('profile.manualReview.oldMobile.label'),
							value: oldMobile,
							rules: [
								{ required: true, message: localeMessage('profile.manualReview.oldMobile.required') },
								{ pattern: PHONE, message: localeMessage('common.test.mobile') },
							],
						},
						{
							type: 'input',
							keyword: 'realName',
							label: localeMessage('profile.manualReview.realName.label'),
							value: realName,
							rules: [
								{ required: true, message: localeMessage('profile.manualReview.realName.required') },
								{ max: 20, message: localeMessage('profile.manualReview.realName.pattern') },
							],
						},
						{
							type: 'input',
							keyword: 'idNumber',
							label: localeMessage('profile.manualReview.idNumber.label'),
							value: idNumber,
							rules: [
								{ required: true, message: localeMessage('profile.manualReview.idNumber.required') },
								{ pattern: IDNUMBER, message: localeMessage('common.test.idNumber') },
							],
						},
						{
							type: 'input',
							keyword: 'companyName',
							label: localeMessage('profile.manualReview.companyName.label'),
							value: companyName,
							rules: [
								{ required: true, message: localeMessage('profile.manualReview.companyName.required') },
								{ max: 100, message: localeMessage('profile.manualReview.companyName.pattern') },
							],
						},
						{
							type: 'upload',
							keyword: 'licenseCopyUrl',
							label: localeMessage('profile.manualReview.licenseCopyUrl.label'),
							value: licenseCopyUrl,
							maxUploadNumber: 1,
							action: '/api/sys/retrievePwdArtificialReview/upload',
							fileRules: [
								{
									maxFileSize: 10 * 1024 * 1024,
									message: localeMessage('profile.manualReview.licenseCopyUrl.maxFileSize'),
								},
								{
									fileExt: ['image/jpg', 'image/jpeg', 'image/png'],
									message: localeMessage('profile.manualReview.licenseCopyUrl.fileExt'),
								},
							],
							beforeText: localeMessage('profile.manualReview.licenseCopyUrl.beforeText'),
							extra: localeMessage('profile.manualReview.licenseCopyUrl.extra'),
							rules: [
								{ required: true, message: localeMessage('profile.manualReview.licenseCopyUrl.required') },
							],
						},
						{
							type: 'textarea',
							keyword: 'description',
							label: localeMessage('profile.manualReview.description.label'),
							value: description,
							rules: [
								{ required: true, message: localeMessage('profile.manualReview.description.required') },
								{ max: 500, message: localeMessage('profile.manualReview.description.pattern') },
							],
						},
					],
				},
			],
			wrappedComponentRef: this.saveFormRef,
		};
		return (
			<div className={styles.content}>
				<UserHeader title={localeMessage('profile.manualReview.header')} />
				<div className={styles.formContent}>
					{
						submitState === '1' && (<div>
							<ESForm {...esFormConfig} />
							<ESFooterButton style={{ left: 0 }}><Button type={'primary'}
								onClick={() => this.submit()}>{localeMessage('profile.manualReview.submit')}</Button></ESFooterButton>
						</div>)
					}
					{
						submitState !== '1' && (
							<div>
								<div className={styles.successTittle}>{localeMessage('profile.manualReview.successTittle')}</div>
								<div className={styles.successContent}>{localeMessage('profile.manualReview.successContent')}</div>
								<Button type={'primary'} onClick={() => this.closeSelf()}>{localeMessage('profile.closePage')}</Button>
							</div>
						)
					}
				</div>
			</div>
		);
	}
}


export default ManualReview;
