import React from 'react';
import { connect } from 'dva';
import ESForm from '@/components/esForm';
import { validatorCooperationDate } from '@/utils/regExp';
import { localeMessage } from '@/utils';

@connect(({ registerCompany }) => ({ registerCompany }))
class SecondContent extends React.Component {

	onChangeStartDate = (date, dateString) => {
		console.log(dateString);
		const data = { operatingPeriodBeginDate: dateString };
		this.updateCompanyInfo(data);
	};

	onChangeEndDate = (date, dateString) => {
		console.log(dateString);
		const data = { operatingPeriodEndDate: dateString };
		this.updateCompanyInfo(data);
	};

	onChangeCheckbox = (e) => {
		console.log(`checked = ${e.target.checked}`);
		this.setState({
			isLongTerm: e.target.checked,
		});
		const data = { longTerm: e.target.checked };
		this.updateCompanyInfo(data);
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
				licenseCopyUrl,
				uscc,
				operatingPeriodBeginDate,
				operatingPeriodEndDate,
				longTerm,
			},
			saveFormRef,
			checkUsccIsExisted,
		} = this.props;

		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'upload',
							keyword: 'licenseCopyUrl',
							label: localeMessage('registerCompany.label.licenseCopyUrl'),
							value: licenseCopyUrl,
							maxUploadNumber: 1,
							action: '/api/sys/companyBusinessLicenseRecord/upload',
							fileRules: [
								{
									maxFileSize: 10 * 1024 * 1024,
									message: localeMessage('common.maxFileSize',{size:'10MB'}),
								},
								{
									fileExt: ['image/jpg', 'image/jpeg', 'image/png'],
									message: localeMessage('common.img.fileExt'),
								},
							],
							beforeText: localeMessage('registerCompany.licenseCopyUrl.beforeText'),
							extra:localeMessage('common.img.extra',{size:'10MB',num:1}),
							rules: [
								{ required: true, message: localeMessage('common.test.fileRequired')+ localeMessage('registerCompany.label.licenseCopyUrl')},
							],
						},
						{
							type: 'input',
							keyword: 'uscc',
							label: localeMessage('registerCompany.label.uscc'),
							value: uscc,
							onBlur: checkUsccIsExisted,
							rules: [
								{ required: true, message: localeMessage('common.test.required')+localeMessage('registerCompany.label.uscc') },
								{ max: 18, message: localeMessage('registerCompany.uscc.max') },
							],
						},
						{
							type: 'esCooperationDate',
							keyword: 'date',
							label: localeMessage('registerCompany.label.operatingPeriodBeginDate'),
							value: {
								startDate: operatingPeriodBeginDate,
								endDate: operatingPeriodEndDate,
								longTerm: longTerm,
							},
							rules: [
								{ validator: validatorCooperationDate },
								{ required: true, message: localeMessage('common.test.required')+localeMessage('registerCompany.label.operatingPeriodBeginDate')},
							]
						},
					],
				},
			],
			wrappedComponentRef: saveFormRef,
		};
		return (
			<ESForm {...esFormConfig} />

		);
	}
}

export default SecondContent;
