import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Button } from 'antd';
import style from './style.less';
import ListItem from './listItem';
import ESFooterButton from '@/components/esFooterButton';
import router from 'umi/router';
import { localeMessage } from '@/utils';
import TableItem from './tableItem';

class DetailList extends React.PureComponent {
	goBack = () => {
		router.goBack();
	};

	render() {
		const {
			listData,
			loading,
			backBtn,
		} = this.props;
		return (
			<div style={loading ? {
				position: 'relative',
				textAlign: 'center',
				opacity: 0.6,
			} : {}}>
				{loading && <Spin className={style.spin} />}
				{
					listData.map((item, index) => {
						if (item.type === 'table') {
							return <TableItem key={index} {...item}></TableItem>;
						} else {
							return <ListItem key={index} {...item}></ListItem>;
						}
					})
				}
				{backBtn && <ESFooterButton><Button type={'primary'} onClick={this.goBack}>{localeMessage('common.back')}</Button></ESFooterButton>}
			</div>
		);
	}
}

DetailList.defaultProps = {
	listData: [],
	loading: false,
	backBtn: false,
};
DetailList.propTypes = {
	listData: PropTypes.array,
	loading: PropTypes.bool,
	backBtn: PropTypes.bool,
};

export default DetailList;

