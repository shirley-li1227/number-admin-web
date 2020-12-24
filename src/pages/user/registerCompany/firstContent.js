import React from 'react';
import { connect } from 'dva';
import { LINK, validatorAddress, areaPhone } from '@/utils/regExp';
import ESForm from '@/components/esForm';
import styles from './index.less';
import { localeMessage } from '@/utils';

@connect(({ registerCompany }) => ({ registerCompany }))
class FirstContent extends React.Component {

	render() {
		const {
			companyInfo: {
				companyName,
				provinceId,
				cityId,
				districtId,
				addressInfo,
				contactPerson,
				portal,
				contactPhone,
			},
			regionList,
			saveFormRef,
		} = this.props;
		const region = [provinceId, cityId, districtId].filter(obj => obj).map(item => String(item));
		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'input',
							keyword: 'companyName',
							label: localeMessage('registerCompany.label.companyName'),
							value: companyName,
							rules: [
								{
									required: true,
									message: localeMessage('common.test.required') + localeMessage('registerCompany.label.companyName'),
								},
								{ max: 100, message: localeMessage('common.test.max',{max:100}) }],
						},
						{
							type: 'esAddress',
							keyword: 'address',
							label: localeMessage('registerCompany.label.companyAddress'),
							rules: [
								{ validator: validatorAddress },
								{
									required: true,
									message: localeMessage('common.test.required') + localeMessage('registerCompany.label.companyAddress'),
								},
							],
							options: regionList,
							value: {
								region: region,
								address: addressInfo,
							},
							inline: false,
						},
						{
							type: 'input',
							keyword: 'contactPerson',
							label: localeMessage('registerCompany.label.contactPerson'),
							value: contactPerson,
							rules: [
								{
									required: true,
									message: localeMessage('common.test.required') + localeMessage('registerCompany.label.contactPerson'),
								},
								{ max: 20, message: localeMessage('common.test.max',{max:20}) },
							],
						},
						{
							type: 'esAreaPhone',
							keyword: 'contactPhone',
							label: localeMessage('registerCompany.label.companyPhone'),
							value: contactPhone,
							rules: [
								{
									required: true,
									message: localeMessage('common.test.required') + localeMessage('registerCompany.label.companyPhone'),
								},
								{ validator: areaPhone },
							],
						},
						{
							type: 'input',
							keyword: 'portal',
							label: localeMessage('registerCompany.label.portal'),
							rules: [
								{
									required: true,
									message: localeMessage('common.test.required') + localeMessage('registerCompany.label.portal'),
								},
								{ pattern: LINK, message: localeMessage('common.test.link') },
							],
							value: portal,
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

export default FirstContent;
