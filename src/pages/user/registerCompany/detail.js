import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from './index.less';
import UserHeader from '@/layouts/userLayout/header';
import ESForm from '@/components/esForm';
import ESTable from '@/components/esTable';
import ESIcon from '@/components/esIcon';
import moment from 'moment';
import router from 'umi/router';
import { localeMessage } from '@/utils';
import { RegisterCategory } from '@/const';

@connect(({ registerCompany }) => ({ registerCompany }))
class RegisterCompanyDetail extends Component {

	componentDidMount() {
		const { dispatch, registerCompany: { detailStatus } } = this.props;
		if (Number(detailStatus) !== 0) {
			dispatch({
				type: 'registerCompany/getCompanyRegistrationInfo',
				payload: {
					isAudit: true,
				},
			});
		}
	}

	onSubmitHandler = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'registerCompany/companyRegister',
		});
	};
	editInfo = (num) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'registerCompany/changeParams',
			payload: {
				current: num,
			},
		});
	};
	editAgain = () => {
		router.replace('/user/registerCompany');
	};

	render() {
		const {
			registerCompany: { companyInfo, brandCategoryList, detailStatus },
		} = this.props;
		let brandCategoryValues = [], categoryNames;
		if (!companyInfo.brandCategoryNames && companyInfo.brandCategoryIds) {
			brandCategoryList.map(item => {
				companyInfo.brandCategoryIds.split(',').map((it) => {
					if (Number(item.id) === Number(it)) {
						brandCategoryValues.push(item.name);
						console.log(item.name);
					}
				});
			});
			categoryNames = brandCategoryValues.join(';');
		} else {
			categoryNames = companyInfo.brandCategoryNames;
		}
		const basicInfoConfig = {
			formList: [
				{
					data: [
						{
							type: 'label',
							keyword: 'companyName',
							label: localeMessage('registerCompany.label.companyName'),
							value: companyInfo.companyName,
						},
						{
							type: 'label',
							keyword: 'address',
							label: localeMessage('registerCompany.label.companyAddress'),
							value: companyInfo.fullAddress,
						},
						{
							type: 'label',
							keyword: 'contactPerson',
							label: localeMessage('registerCompany.label.contactPerson'),
							value: companyInfo.contactPerson,
						},
						{
							type: 'label',
							keyword: 'contactPhone',
							label: localeMessage('registerCompany.label.companyPhone'),
							value: companyInfo.contactPhone,
						},
						{
							type: 'label',
							keyword: 'portal',
							label: localeMessage('registerCompany.label.portal'),
							value: companyInfo.portal,
						},
					],
				},
			],
		};
		const businessLicenseInfoConfig = {
			formList: [
				{
					data: [
						{
							type: 'img',
							label: localeMessage('registerCompany.label.licenseCopyUrl'),
							keyword: 'licenseCopyUrl',
							src: companyInfo.licenseCopyUrl,
						},
						{
							type: 'label',
							label: localeMessage('registerCompany.label.uscc'),
							keyword: 'uscc',
							value: companyInfo.uscc,
						},
						{
							type: 'label',
							label: localeMessage('registerCompany.label.operatingPeriodBeginDate'),
							keyword: 'operatingPeriodBeginDate',
							value: `${companyInfo.operatingPeriodBeginDate ? moment((companyInfo.operatingPeriodBeginDate)).format('YYYY-MM-DD') : ''} ${localeMessage('registerCompany.to')} ${companyInfo.longTerm ? localeMessage('registerCompany.longTime') : (companyInfo.operatingPeriodEndDate ? moment((companyInfo.operatingPeriodEndDate)).format('YYYY-MM-DD') : '')}`,
						},
					],
				},
			],
		};
		const brandInfoConfig = {
			formList: [
				{
					data: [
						{
							type: 'label',
							keyword: 'brandName',
							label: localeMessage('registerCompany.label.brandChineseName'),
							value: companyInfo.brandName,
						},
						{
							type: 'label',
							keyword: 'brandEnglishName',
							label: localeMessage('registerCompany.label.brandEnglishName'),
							value: companyInfo.brandEnglishName,
						},
						RegisterCategory ? {
							type: 'label',
							keyword: 'brandCategoryIds',
							label: localeMessage('registerCompany.label.brandCategoryIds'),
							value: categoryNames,
						} : null,
						{
							type: 'img',
							keyword: 'brandLogoUrl',
							label: localeMessage('registerCompany.label.brandLogoUrl'),
							src: companyInfo.brandLogoUrl,
						},
						{
							type: 'label',
							keyword: 'certificateValidDate',
							label: localeMessage('registerCompany.certificateValidDate.label'),
							value: companyInfo.certificateValidDate ? moment((companyInfo.certificateValidDate)).format('YYYY-MM-DD') : '',
						},
						{
							type: 'imgList',
							keyword: 'certificateUrls',
							label: localeMessage('registerCompany.certificateUrls.label'),
							imgList: companyInfo.certificateUrls,
						},
						{
							type: 'label',
							keyword: 'introduction',
							label: localeMessage('registerCompany.introduction.label'),
							value: companyInfo.introduction,
						},
						{
							type: 'label',
							keyword: 'enabledAfterAudited',
							label: localeMessage('registerCompany.enabledAfterAudited.label'),
							value: companyInfo.enabledAfterAudited ? localeMessage('common.options.yes') : localeMessage('common.options.no'),
						},
					],
				},
			],
		};
		const tableColumns = {
			auditStatus: {
				title: localeMessage('registerCompany.type.label'),
				dataIndex: 'type',
				key: 'type',
				sort: 1,
				render: (text) => {
					if (text === 'submit') {
						return localeMessage('registerCompany.type.submit');
					} else if (text === 'audited') {
						return localeMessage('registerCompany.type.audited');
					} else if (text === 'rejected') {
						return localeMessage('registerCompany.type.rejected');
					}
				},
			},
			auditTime: {
				title: localeMessage('registerCompany.createTime.label'),
				dataIndex: 'createTime',
				key: 'createTime',
				sort: 2,
				render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
			},
		};
		const columns = Object.values(tableColumns).sort((a, b) => a.sort - b.sort);
		const tableProps = {
			pagination: false,
			dataSource: companyInfo.auditList,
			columns,
		};

		console.log(basicInfoConfig);
		console.log(businessLicenseInfoConfig);
		return (
			<div className={styles.detail}>
				{detailStatus !== 2 && <UserHeader title={localeMessage('registerCompany.header.title')} />}
				<div className={styles.detailContent}>
					{
						detailStatus !== 3 &&
						<div className={styles.detailTitle}>
							<ESIcon className={styles.tipsIcon} style={{ color: '#33a3dc' }} type={'icon-ic_notice'}></ESIcon>
							{detailStatus === 0 ? localeMessage('registerCompany.detailStatus.submit') :
								(detailStatus === 2 ? localeMessage('registerCompany.detailStatus.audited') : localeMessage('registerCompany.detailStatus.review'))}</div>
					}
					{detailStatus === 3 &&
						<div>
							<div className={styles.detailFailTitle}>
								<div className={styles.failInfo}>
									<ESIcon className={styles.tipsIcon} style={{ color: '#ffab34' }} type={'icon-gth'}></ESIcon>{localeMessage('registerCompany.detailStatus.reject')}</div>
								<div className={styles.auditInfo}>{companyInfo.auditInfo}</div>
							</div>
							<div className={styles.auditBtn}>
								<Button type="primary" ghost={true}
									onClick={() => this.editAgain()}>{localeMessage('registerCompany.editAndSubmit.btn')}</Button>
							</div>
						</div>
					}
					<div className={styles.infoTitleRow}>
						<span className={styles.infoTitle}>{localeMessage('registerCompany.basicInfo.title')}</span>
						{
							detailStatus === 0 && <a onClick={() => this.editInfo(0)}>{localeMessage('common.modify')}</a>
						}
					</div>
					<div className={styles.infoDetail}>
						<ESForm {...basicInfoConfig} />
					</div>
					<div className={styles.infoTitleRow}>
						<span className={styles.infoTitle}>{localeMessage('registerCompany.businessLicenseInfo.title')}</span>
						{
							detailStatus === 0 && <a onClick={() => this.editInfo(1)}>{localeMessage('common.modify')}</a>
						}
					</div>
					<div className={styles.infoDetail}>
						<ESForm {...businessLicenseInfoConfig} />
					</div>
					<div className={styles.infoTitleRow}>
						<span className={styles.infoTitle}>{localeMessage('registerCompany.brandInfo.title')}</span>
						{
							detailStatus === 0 && <a onClick={() => this.editInfo(2)}>{localeMessage('common.modify')}</a>
						}
					</div>
					<div className={styles.infoDetail}>
						<ESForm {...brandInfoConfig} />
					</div>
					{
						detailStatus === 0 && <div className={styles.submitBtnRow}>
							<Button type="primary" onClick={this.onSubmitHandler}>{localeMessage('registerCompany.confirmSubmit.btn')}</Button>
						</div>
					}
					{detailStatus !== 0 &&
						<div>
							<div className={styles.infoTitleRow}>
								<span className={styles.infoTitle}>{localeMessage('registerCompany.auditLog.title')}</span>
							</div>
							<div>
								<ESTable {...tableProps} />
							</div>
						</div>
					}
				</div>
			</div>

		);
	}
}

export default RegisterCompanyDetail;
