import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import { localeMessage } from '@/utils';
//components
import ESFilter from '@/components/esFilter';
import ESTable from '@/components/esTable';

@connect(({ selectCustomerModal, loading }) => ({
	selectCustomerModal,
	loading: loading.models['selectCustomerModal'],
}))
class SelectCustomer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
			name: '',
		};
	}
	componentDidMount(){
		const { dispatch } = this.props;
		dispatch({
			type: 'selectCustomerModal/queryList',
		});
	}
	onSubmit = (values) => {
		this.setState({
			...values,
		});
		const { dispatch } = this.props;
		dispatch({
			type: 'selectCustomerModal/queryListP',
			payload: { ...values },
		});
	};
	changeHandler = ({ current, pageSize }) => {
		console.log(current,pageSize);
		const { dispatch } = this.props;
		dispatch({
			type: 'selectCustomerModal/queryListP',
			payload: { page: current, pageSize },
		});
	};
	select = (record) => {
		const { onSelect } = this.props;
		onSelect(record);
	};

	render() {
		const { modalOpts, loading, selectCustomerModal: { list, pagination } } = this.props;
		const { code, name } = this.state;

		const filterConfig = {
			code: {
				type: 'input',
				label: localeMessage('billOfSales.list.customercode'),
				keyword: 'code',
				sort: 1,
			},
			name: {
				type: 'input',
				label: localeMessage('billOfSales.list.customername'),
				keyword: 'name',
				sort: 2,
			},
		};
		const forms = Object.values(filterConfig).sort((a, b) => a.sort - b.sort);
		const filterProps = {
			filter: {
				code,
				name,
				isEnabled: '1',
			},
			forms,
			wrappedComponentRef: this.saveFormRef,
			onSubmit: this.onSubmit,
		};
		const tableColumns = {
			code: {
				title: localeMessage('billOfSales.list.customercode'),
				dataIndex: 'code',
				tip: localeMessage('productionBatch.addQty.diy'),
				key: 'code',
				sort: 1,
			},
			name: {
				title: localeMessage('billOfSales.list.customername'),
				dataIndex: 'name',
				key: 'name',
				sort: 2,
			},
			select: {
				title: '',
				dataIndex: 'select',
				key: 'select',
				sort: 4,
				align: 'center',
				render: (text, record) => {
					return <a onClick={() => this.select(record)}>{localeMessage('common.select')}</a>;
				},
			},
		};
		const columns = Object.values(tableColumns).sort((a, b) => a.sort - b.sort);
		const tableProps = {
			pagination,
			dataSource: list,
			columns,
			loading: loading,
			onChange: this.changeHandler,
		};
		return (
			<Modal {...modalOpts}>
				<ESFilter {...filterProps} />
				<ESTable {...tableProps} />
			</Modal>
		);
	}
}


export default SelectCustomer;
