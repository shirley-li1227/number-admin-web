import React from 'react';
import styles from './index.less';
import ESForm from '@/components/esForm';
import { connect } from 'dva';
import moment from 'moment';
import ESIcon from '@/components/esIcon';
import { localeMessage } from '@/utils';
import { RegisterCategory } from '@/const';

@connect(({ registerCompany }) => ({ registerCompany }))
class ThirdContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: true,
			brandTitle: true,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ brandTitle: false });
		}, 8000);
	}

	onChangeDate = (date, dateString) => {
		console.log(dateString);
		const data = { certificateValidDate: dateString };
		this.updateCompanyInfo(data);
	};
	onChangeRadio = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
			value: e.target.value,
		});
	};
	updateCompanyInfo = (data) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'registerCompany/updateCompanyInfo',
			payload: data,
		});
	};

	render() {
		const {
			companyInfo: {
				brandName,
				brandEnglishName,
				brandCategoryIds,
				brandLogoUrl,
				certificateUrls,
				certificateValidDate,
				introduction,
				enabledAfterAudited,
			},
			brandCategoryList,
			saveFormRef,
		} = this.props;
		const { brandTitle } = this.state;
		let brandCategoryValues = [];
		if (brandCategoryIds) {
			brandCategoryIds.split(',').map((it) => {
				brandCategoryValues.push(Number(it));
			});
			console.log(brandCategoryValues);
		}
		const brandCategory = brandCategoryIds ? {
			value: brandCategoryValues,
		} : {};
		console.log(certificateValidDate);
		const date = certificateValidDate ? {
			value: certificateValidDate ? moment(certificateValidDate) : '',
		} : {};
		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'input',
							keyword: 'brandName',
							label: localeMessage('registerCompany.label.brandChineseName'),
							value: brandName,
							rules: [
								{ required: true, message: localeMessage('common.test.required') + localeMessage('registerCompany.label.brandChineseName') },
								{ max: 50, message: localeMessage('common.test.max', { max: 50 }) },
							],
						},
						{
							type: 'input',
							keyword: 'brandEnglishName',
							label: localeMessage('registerCompany.label.brandEnglishName'),
							value: brandEnglishName,
							rules: [
								{
									pattern: /^[^\u4e00-\u9fa5]{0,}$/,
									message: localeMessage('registerCompany.brandEnglishName.pattern'),
								},
								{ max: 50, message: localeMessage('common.test.max', { max: 50 }) },
							],
						},
						RegisterCategory ? {
							type: 'select',
							mode: 'multiple',
							keyword: 'brandCategoryIds',
							label: localeMessage('registerCompany.label.brandCategoryIds'),
							...brandCategory,
							options: brandCategoryList,
							rules: [
								{ required: true, message: localeMessage('common.test.selectRequired') + localeMessage('registerCompany.label.brandCategoryIds') },
							],
						} : null,
						{
							type: 'upload',
							keyword: 'brandLogoUrl',
							label: localeMessage('registerCompany.label.brandLogoUrl'),
							value: brandLogoUrl,
							maxUploadNumber: 1,
							action: '/api/sys/brand/uploadLogo',
							fileRules: [
								{
									maxFileSize: 2 * 1024 * 1024,
									message: localeMessage('common.maxFileSize', { size: '2MB' }),
								},
								{
									fileExt: ['image/jpg', 'image/jpeg', 'image/png'],
									message: localeMessage('common.img.fileExt'),
								},
							],
							extra: localeMessage('registerCompany.brandLogoUrl.extra'),
							rules: [
								{ required: true, message: localeMessage('common.test.fileRequired') + localeMessage('registerCompany.label.brandLogoUrl') },
							],
						},
						{
							type: 'datePicker',
							keyword: 'certificateValidDate',
							label: localeMessage('registerCompany.certificateValidDate.label'),
							...date,
							rules: [
								{
									required: true,
									message: localeMessage('common.test.selectRequired') + localeMessage('registerCompany.certificateValidDate.label'),
								},
							],
						},
						{
							type: 'upload',
							keyword: 'certificateUrls',
							label: localeMessage('registerCompany.certificateUrls.label'),
							value: certificateUrls,
							maxUploadNumber: 5,
							action: '/api/sys/brand/uploadCertificate',
							fileRules: [
								{
									maxFileSize: 10 * 1024 * 1024,
									message: localeMessage('common.maxFileSize', { size: '10MB' }),
								},
								{
									fileExt: ['image/jpg', 'image/jpeg', 'image/png'],
									message: localeMessage('common.img.fileExt'),
								},
							],
							extra: localeMessage('registerCompany.certificateUrls.label') + localeMessage('common.img.extra', { size: '10MB', num: 5 }),
							rules: [
								{ required: true, message: localeMessage('common.test.fileRequired') + localeMessage('registerCompany.certificateUrls.label') },
							],
						},
						{
							type: 'textarea',
							keyword: 'introduction',
							label: localeMessage('registerCompany.introduction.label'),
							value: introduction,
							rules: [
								{ required: true, message: localeMessage('common.test.required') + localeMessage('registerCompany.introduction.label') },
								{ max: 2000, message: localeMessage('common.test.max', { max: 2000 }) },
							],
						},
						{
							type: 'radio',
							keyword: 'enabledAfterAudited',
							label: localeMessage('registerCompany.enabledAfterAudited.label'),
							value: enabledAfterAudited === undefined ? true : enabledAfterAudited,
							options: [{
								name: localeMessage('common.options.yes'),
								value: true,
							}, {
								name: localeMessage('common.options.no'),
								value: false,
							}],
							rules: [
								{ required: true, message: localeMessage('common.test..selectRequired') + localeMessage('registerCompany.enabledAfterAudited.label') },
							],
						},
					],
				},
			],
			wrappedComponentRef: saveFormRef,
		};
		return (
			<div>
				{brandTitle &&
					<div className={styles.brandTitle}><ESIcon className={styles.tipsIcon} style={{ color: '#33a3dc' }}
						type={'icon-ic_notice'}></ESIcon>{localeMessage('registerCompany.tips')}</div>}
				<ESForm {...esFormConfig} />
			</div>

		);
	}
}

export default ThirdContent;
