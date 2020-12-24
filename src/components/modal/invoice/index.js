import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

// components
import { Modal } from 'antd';
import ESForm from '@/components/esForm';
import { localeMessage } from '@/utils';

@connect(({ modalInvoice, loading }) => ({
	modalInvoice,
	loading: loading.models['modalInvoice'],
}))
class ModalInvoice extends React.Component {
	state = {
		invoiceType: 1,
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
				type: 'modalInvoice/queryDetail',
				payload: {
					id: editId
				}
			});
		}

		this.setState({
			visible: true,
			invoiceType: 1,
		});
	}

	onHide = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'modalInvoice/changeState',
			payload: {
				detail: {},
			}
		});
		this.setState({
			invoiceType: 1,
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
				default: values.defaultCheck.length ? 1 : 0,
				id: editId
			};

			dispatch({
				type: editId ? 'modalInvoice/update' : 'modalInvoice/create',
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

	invoiceTypeChange = (e) => {
		this.setState({
			invoiceType: e.target.value,
		});
	}

	render() {
		const { visible, invoiceType } = this.state;
		const {
			editId,
			children,
			modalInvoice: {
				detail,
			},
			loading,
		} = this.props;

		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'radio',
							keyword: 'invoiceType',
							label: localeMessage('companyInvoice.label.invoiceTypeName'),
							value: detail.invoiceType || 1,
							onChange: this.invoiceTypeChange,
							options: [{
								name: localeMessage('companyInvoice.invoiceTypeName.option1'),
								value: 1,
							}, {
								name: localeMessage('companyInvoice.invoiceTypeName.option2'),
								value: 2,
							}],
							rules: [
								{ required: true, message: localeMessage('common.test.selectRequired') + localeMessage('companyInvoice.label.invoiceTypeName') },
							],
						},
						{
							type: 'input',
							keyword: 'invoiceTitle',
							label: localeMessage('companyInvoice.label.invoiceTitle'),
							value: detail.invoiceTitle,
							placeholder: localeMessage('companyInvoice.invoiceTitle.placeholder'),
							rules: [
								{ required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoice.label.invoiceTitle') },
								{ max: 50, message: localeMessage('common.test.max', { max: 50 }) }
							],
						},
						{
							type: 'input',
							keyword: 'taxpayerIdentity',
							label: localeMessage('companyInvoice.label.taxpayerIdentity'),
							value: detail.taxpayerIdentity,
							placeholder: localeMessage('companyInvoice.taxpayerIdentity.placeholder'),
							rules: [
								{ required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoice.label.taxpayerIdentity') },
								{ pattern: /^[A-Za-z0-9]*$/, message: localeMessage('companyInvoice.taxpayerIdentity.pattern') },
								{ max: 30, message: localeMessage('common.test.max', { max: 30 }) },
							],
							extra: localeMessage('companyInvoice.taxpayerIdentity.extra'),
						},
						{
							type: 'input',
							keyword: 'bankName',
							label: localeMessage('companyInvoice.label.bankName'),
							value: detail.bankName,
							placeholder: localeMessage('companyInvoice.bankName.placeholder'),
							rules: [
								invoiceType === 2 ? { required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoice.label.bankName') } : {},
								{ max: 50, message: localeMessage('common.test.max', { max: 50 }) },
							],
						},
						{
							type: 'input',
							keyword: 'bankAccount',
							label: localeMessage('companyInvoice.label.bankAccount'),
							value: detail.bankAccount,
							placeholder: localeMessage('companyInvoice.bankAccount.placeholder'),
							rules: [
								invoiceType === 2 ? { required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoice.label.bankAccount') } : {},
								{ pattern: /^[0-9]*$/, message: localeMessage('companyInvoice.bankAccount.pattern') },
								{ max: 32, message: localeMessage('common.test.max', { max: 32 }) },
								{ min: 6, message: localeMessage('common.test.min', { min: 6 }) },
							],
							extra: localeMessage('companyInvoice.label.bankAccount') + localeMessage('companyInvoice.common.extra', { min: 6, max: 32 }),
						},
						{
							type: 'input',
							keyword: 'registerAddress',
							label: localeMessage('companyInvoice.label.registerAddress'),
							value: detail.registerAddress,
							placeholder: localeMessage('companyInvoice.registerAddress.placeholder'),
							rules: [
								invoiceType === 2 ? { required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoice.label.registerAddress') } : {},
								{ max: 84, message: localeMessage('common.test.max', { max: 84 }) },
								{ min: 5, message: localeMessage('common.test.min', { min: 5 }) },
							],
							extra: localeMessage('companyInvoice.label.registerAddress') + localeMessage('companyInvoice.common.extra', { min: 5, max: 84 }),
						}, {
							type: 'input',
							keyword: 'fixedPhone',
							label: localeMessage('companyInvoice.label.fixedPhone'),
							value: detail.fixedPhone,
							placeholder: localeMessage('companyInvoice.fixedPhone.placeholder'),
							rules: [
								invoiceType === 2 ? { required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoice.label.fixedPhone') } : {},
								{ max: 17, message: localeMessage('common.test.max', { max: 17 }) },
								{ min: 5, message: localeMessage('common.test.min', { min: 5 }) },
							],
							extra: localeMessage('companyInvoice.label.fixedPhone') + localeMessage('companyInvoice.common.extra', { min: 5, max: 17 }),
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


ModalInvoice.defaultProps = {
	editId: null,
};

ModalInvoice.propTypes = {
	onOk: PropTypes.func.isRequired,
	editId: PropTypes.number,
};

export default ModalInvoice;
