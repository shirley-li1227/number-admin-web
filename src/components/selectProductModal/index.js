import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import { localeMessage } from '@/utils';
//components
import ESFilter from '@/components/esFilter';
import ESTable from '@/components/esTable';

@connect(({ selectProductModal, loading }) => ({
	selectProductModal,
	loading: loading.models['selectProductModal'],
}))
class SelectProduct extends React.Component {
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
			type: 'selectProductModal/getProductList',
		});
	}

	onSubmit = (values) => {
		this.setState({
			...values,
		});
		const { dispatch } = this.props;
		dispatch({
			type: 'selectProductModal/getProductList',
			payload: { ...values },
		});
	};
	changeHandler = ({ current, pageSize }) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'selectProductModal/getProductList',
			payload: { page: current, pageSize },
		});
	};
	select = (record) => {
		const { onSelect } = this.props;
		onSelect(record);
	};

	render() {
		const { modalOpts, loading, selectProductModal: { productList, pagination } } = this.props;
		const { code, name } = this.state;

		const filterConfig = {
			code: {
				type: 'input',
				label: localeMessage('product.code'),
				keyword: 'code',
				sort: 1,
			},
			name: {
				type: 'input',
				label: localeMessage('product.name'),
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
				title: localeMessage('product.code'),
				dataIndex: 'code',
				tip: localeMessage('productionBatch.addQty.diy'),
				key: 'code',
				sort: 1,
			},
			name: {
				title: localeMessage('product.name'),
				dataIndex: 'name',
				key: 'name',
				sort: 2,
			},
			brandName: {
				title: localeMessage('brand.title'),
				dataIndex: 'brandName',
				key: 'brandName',
				sort: 3,
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
			dataSource: productList,
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


export default SelectProduct;
