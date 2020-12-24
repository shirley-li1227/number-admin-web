import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

// utils
import { PHONE, FIXEDPHONE } from '@/utils/regExp';

// components
import { Modal } from 'antd';
import ESForm from '@/components/esForm';
import { localeMessage } from '@/utils';

@connect(({ receiveAddress, loading }) => ({
	receiveAddress,
	loading: loading.models['receiveAddress'],
}))
class ReceiveAddress extends React.Component {
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
				type: 'receiveAddress/queryDetail',
				payload: {
					id: editId
				}
			});
		}

		dispatch({
			type: 'receiveAddress/queryRegion'
		});

		this.setState({
			visible: true
		});
	}

	onHide = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'receiveAddress/changeState',
			payload: {
				detail: {}
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
				type: 1,	// 收货人地址默认1
				provinceId: values.address[0],
				cityId: values.address[1],
				districtId: values.address[2],
				default: values.default.length ? 1 : 0,
				id: editId
			};

			dispatch({
				type: editId ? 'receiveAddress/update' : 'receiveAddress/create',
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
			receiveAddress: {
				detail,
				regionList,
			},
			loading,
			children,
		} = this.props;

		const region = [detail.provinceId, detail.cityId, detail.districtId].filter(obj => obj).map(item => String(item));

		const esFormConfig = {
			formList: [
				{
					data: [
						{
							type: 'input',
							keyword: 'contactPerson',
							label: localeMessage('modal.receiveAddress.contactPerson.label'),
							value: detail.contactPerson,
							rules: [
								{ required: true, message: localeMessage('common.test.required') + localeMessage('modal.receiveAddress.contactPerson.label') },
								{ max: 20, message: localeMessage('common.test.max', { max: 20 }) },
								{ min: 2, message: localeMessage('common.test.min', { min: 2 }) },
							],
						},
						{
							type: 'cascader',
							keyword: 'address',
							label: localeMessage('modal.receiveAddress.address.label'),
							options: regionList,
							value: region,
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
								{ required: true, message: localeMessage('common.test.required') + localeMessage('companyInvoiceAddress.contactAddress.label') },
								{ max: 50, message: localeMessage('common.test.max', { max: 50 }) },
							],
						},
						{
							type: 'input',
							keyword: 'contactPhone',
							label: localeMessage('modal.receiveAddress.contactPhone.label'),
							value: detail.contactPhone,
							rules: [
								{ required: true, message: localeMessage('common.test.required') + localeMessage('modal.receiveAddress.contactPhone.label') },
								{ pattern: PHONE, message: localeMessage('common.test.mobile') },
							],
						},
						{
							type: 'input',
							keyword: 'contactFixedPhone',
							label: localeMessage('modal.receiveAddress.contactFixedPhone.label'),
							value: detail.contactFixedPhone,
							rules: [
								{ pattern: FIXEDPHONE, message: localeMessage('common.test.fixedPhone') },
								{ max: 17, message: localeMessage('common.test.max', { max: 17 }) },
								{ min: 5, message: localeMessage('common.test.min', { min: 5 }) },
							],
						},
						{
							type: 'checkbox',
							keyword: 'default',
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
			title: editId ? localeMessage('modal.receiveAddress.title.edit') : localeMessage('modal.receiveAddress.title.create'),
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


ReceiveAddress.defaultProps = {
	editId: null,
};

ReceiveAddress.propTypes = {
	onOk: PropTypes.func.isRequired,
	editId: PropTypes.number,
};

export default ReceiveAddress;
