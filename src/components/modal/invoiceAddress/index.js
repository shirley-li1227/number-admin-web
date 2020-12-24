import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

// utils
import { PHONE } from '@/utils/regExp';
import { localeMessage } from '@/utils';

// components
import { Modal } from 'antd';
import ESForm from '@/components/esForm';

@connect(({ modalInvoiceAddress, loading }) => ({
	modalInvoiceAddress,
	loading: loading.models['modalInvoiceAddress'],
}))
class ModalInvoiceAddress extends React.Component {
	state = {
		visible: false
	}

	saveFormRef = formRef => {
		this.formRef = formRef;
	}

	onShow = () => {
		const {
			dispatch,
			editId,
		} = this.props;
		if (editId) {
			dispatch({
				type: 'modalInvoiceAddress/queryDetail',
				payload: {
					id: editId
				}
			});
		}

		dispatch({
			type: 'modalInvoiceAddress/queryRegion'
		});

		this.setState({
			visible: true,
		});
	}

	onHide = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'modalInvoiceAddress/changeState',
			payload: {
				detail: {},
			}
		});
		this.setState({
			visible: false
		});

		this.formRef.props.form.resetFields();
	}

	handlerOk = () => {
		const { dispatch, onOk, editId } = this.props;
		const { validateFields } = this.formRef.props.form;
		validateFields((err, values) => {
			if (err) return;
			const payload = {
				...values,
				type: 2,	// 发票地址默认2
				provinceId: values.address[0],
				cityId: values.address[1],
				districtId: values.address[2],
				default: values.defaultCheck.length ? 1 : 0,
				id: editId
			};

			dispatch({
				type: editId ? 'modalInvoiceAddress/update' : 'modalInvoiceAddress/create',
				payload,
				callback: () => {
					onOk();
					this.onHide();
				}
			});
		});
	}

	handlerCancel = () => {
		this.onHide();
	}

	render() {
		const { visible } = this.state;
		const {
			editId,
			children,
			modalInvoiceAddress: {
				detail,
				regionList,
			},
			loading,
		} = this.props;

		const region = [detail.provinceId, detail.cityId, detail.districtId].filter(obj => obj).map(item => String(item));
		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'input',
							keyword: 'contactPerson',
							label: localeMessage('companyInvoiceAddress.contactPerson.label'),
							value: detail.contactPerson,
							rules: [
								{ required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoiceAddress.contactPerson.label') },
								{ max: 50, message: localeMessage('common.test.max', { max: 50 }) },
								{ min: 2, message: localeMessage('common.test.min', { min: 2 }) },
							],
						},
						{
							type: 'cascader',
							keyword: 'address',
							label: localeMessage('companyInvoiceAddress.address.label'),
							options: regionList,
							value: region,
							onChange: this.onChange,
							placeholder: ' ',
							rules: [
								{ required: true, message: localeMessage('common.test.selectRequired') + localeMessage('companyInvoiceAddress.address.label') },
							],
						},
						{
							type: 'input',
							keyword: 'contactAddress',
							label: localeMessage('companyInvoiceAddress.contactAddress.label'),
							value: detail.contactAddress,
							rules: [
								{ required: true, message: localeMessage('common.test.selectRequired') + localeMessage('companyInvoiceAddress.contactAddress.label') },
								{ max: 50, message: localeMessage('common.test.max', { max: 50 }) },
							],
						},
						{
							type: 'input',
							keyword: 'postcode',
							label: localeMessage('companyInvoiceAddress.postcode.label'),
							value: detail.postcode,
							rules: [
								{ pattern: /^\d{6}$/, message: localeMessage('companyInvoiceAddress.postcode.pattern') },
								{ max: 6, message: localeMessage('common.test.max', { max: 6 }) },
							],
						},
						{
							type: 'input',
							keyword: 'contactPhone',
							label: localeMessage('companyInvoiceAddress.contactPhone.label'),
							value: detail.contactPhone,
							rules: [
								{ required: true, message: localeMessage('common.test.selectRequired') + localeMessage('companyInvoiceAddress.contactPhone.label') },
								{ pattern: PHONE, message: localeMessage('common.test.mobile') },
							],
						},
						{
							type: 'checkbox',
							keyword: 'defaultCheck',
							label: localeMessage('companyInvoice.label.defaultCheck'),
							options: [
								{ label: localeMessage('common.options.yes'), value: 1 },
							],
							value: detail.default ? [1] : [],
						},
					],
				},
			],
			wrappedComponentRef: this.saveFormRef,
		};

		const modalProps = {
			visible,
			title: editId ? localeMessage('modal.invoice.title.edit') : localeMessage('modal.invoice.title.create'),
			onOk: this.handlerOk,
			onCancel: this.handlerCancel,
			okButtonProps: {
				loading,
			}
		};

		return (
			<span>
				<span onClick={this.onShow} style={{ cursor: 'pointer' }}>{children}</span>
				<Modal {...modalProps}>
					<ESForm {...esFormConfig} />
				</Modal>
			</span>

		);
	}
}


ModalInvoiceAddress.defaultProps = {
	editId: null,
};

ModalInvoiceAddress.propTypes = {
	onOk: PropTypes.func.isRequired,
	editId: PropTypes.number,
};

export default ModalInvoiceAddress;
