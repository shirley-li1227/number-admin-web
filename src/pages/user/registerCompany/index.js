import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Steps } from 'antd';
import styles from './index.less';
import FirstContent from './firstContent.js';
import SecondContent from './secondContent.js';
import ThirdContent from './thirdContent.js';
import LastContent from './lastContent.js';
import UserHeader from '@/layouts/userLayout/header';
import moment from 'moment';
import { localeMessage } from '@/utils';
const Step = Steps.Step;

@connect(({ registerCompany }) => ({ registerCompany }))
class RegisterCompany extends Component {

	onSubmitHandler = (current) => {
		const { dispatch } = this.props;
		const { regionList } = this.props.registerCompany;
		const form = this.formRef.props.form;

		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			console.log('Received values of form: ', values);
			if (current == 0) {
				const { address } = values;
				const provinceId = address.region[0];
				const cityId = address.region[1];
				const districtId = address.region[2];
				const addressInfo = address.address;
				let provinceName, cityName, districtName = '';
				regionList.map((item) => {
					if (String(item.id) === provinceId) {
						provinceName = item.name;
						item.children.map((it) => {
							if (String(it.id) === cityId) {
								cityName = it.name;
								it.children && it.children.map((t) => {
									if (String(t.id) === districtId) {
										districtName = t.name;
									}
								});
							}
						});
					}
				});
				const fullAddress = provinceName + cityName + districtName + address.address;
				const payload = {
					provinceId,
					cityId,
					districtId,
					fullAddress,
					addressInfo,
					...values
				};
				console.log(payload);
				dispatch({
					type: 'registerCompany/firstStep',
					payload: {
						...payload,
					},
				});
			} else if (current == 1) {
				const params = {
					licenseCopyUrl: values.licenseCopyUrl,
					uscc: values.uscc,
					operatingPeriodBeginDate: values.date.startDate,
					operatingPeriodEndDate: values.date.endDate,
					longTerm: values.date.longTerm,
				};
				dispatch({
					type: 'registerCompany/secondStep',
					payload: {
						...params,
					},
				});
			} else if (current == 2) {
				values.certificateValidDate = moment(values.certificateValidDate).format('YYYY-MM-DD');
				if (values.brandCategoryIds instanceof Array) {
					values.brandCategoryIds = values.brandCategoryIds.join(',');
				}
				dispatch({
					type: 'registerCompany/thirdStep',
					payload: {
						...values,
					},
				});
			}
		});
	};
	prevStep = (current) => {
		const { dispatch } = this.props;
		console.log(current);
		dispatch({
			type: 'registerCompany/prevStep',
			payload: {
				current: Number(current) - 1
			},
		});
	};
	saveFormRef = formRef => {
		this.formRef = formRef;
	};

	checkUsccIsExisted = () => {
		const form = this.formRef.props.form;
		const uscc = form.getFieldValue('uscc');
		const { dispatch } = this.props;
		if (uscc) {
			dispatch({
				type: 'registerCompany/checkUsccIsExisted',
				payload: {
					uscc,
				},
			});
		}
	};

	render() {
		const {
			registerCompany: { current = 0, companyInfo, regionList, brandCategoryList },
		} = this.props;
		console.log(current);
		const steps = [
			{
				title: localeMessage('registerCompany.basicInfo.title'),
				content: (
					<FirstContent
						saveFormRef={this.saveFormRef}
						companyInfo={companyInfo}
						regionList={regionList}
						onSubmitHandler={this.onSubmitHandler}
					/>
				),
			},
			{
				title: localeMessage('registerCompany.businessLicenseInfo.title'),
				content: (
					<SecondContent
						checkUsccIsExisted={this.checkUsccIsExisted}
						saveFormRef={this.saveFormRef}
						companyInfo={companyInfo}
						onSubmitHandler={this.onSubmitHandler}
					/>
				),
			},
			{
				title: localeMessage('registerCompany.brandInfo.title'),
				content: <ThirdContent
					saveFormRef={this.saveFormRef}
					companyInfo={companyInfo}
					onSubmitHandler={this.onSubmitHandler}
					brandCategoryList={brandCategoryList}
				/>,
			},
			{
				title: localeMessage('common.submit.success'),
				content: <LastContent />,
			},
		];
		return (
			<div className={styles.content}>
				<UserHeader title={localeMessage('registerCompany.header.title')} />
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
								onClick={() => this.onSubmitHandler(current)}
							>
								{localeMessage('common.next')}
							</Button>
						)}
						{current > 0 && current != steps.length - 1 && (
							<Button
								className={styles.prevBtn}

								onClick={() => this.prevStep(current)}
							>
								{localeMessage('common.previous')}
							</Button>
						)
						}
						{current === steps.length - 1 && (
							<Button
								type="primary"
								onClick={this.goLogin}
							>
								{localeMessage('registerCompany.goLogin.btn')}
							</Button>
						)}
					</div>
				</div>
			</div>

		);
	}
}

export default RegisterCompany;
