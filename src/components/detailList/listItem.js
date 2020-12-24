import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tooltip, Icon } from 'antd';
import style from './style.less';
import moment from 'moment';
import styles from '../esForm/index.less';
import ESPreview from '@/components/esPreviewImages';
import { localeMessage } from '@/utils';

const defaultLayout = {
	normal: {
		label: {
			span: 6,
		},
		value: {
			span: 16,
		},
	},
};

class ListItem extends React.PureComponent {
	onPreview = (file, index) => {
		ESPreview.open({
			data: file,
			showIndex: index,
		});
	};

	render() {
		const {
			detailsData,
			title,
			subData,
			isDoubleList = false,
			Layout,
			blankLine,
		} = this.props;
		const listLayout = Layout ? Layout : defaultLayout;
		const view = (list) => {
			if (!list.type) {
				return;
			}
			if (list.type === 'img') {
				return list.src ? (<span onClick={() => this.onPreview([list.src])}>
					<img src={list.src}
						style={{ width: list.width || '84px', height: list.height || '84px', objectFit: 'contain' }}
						alt="" />
				</span>) : null;
			} else if (list.type === 'imgList') {
				const imgList = list.imgList;
				if (imgList) {
					return list.imgList.map((item, index) => {
						return (<span className={style.img_item} key={index}
							onClick={() => this.onPreview(list.imgList, index)}>
							<img src={item}
								style={{ width: 84, height: 84, display: 'inline-block', objectFit: 'contain' }}
								alt={localeMessage('common.label.imgName')} />
						</span>);
					});
				}
			} else if (list.type === 'date') {
				return list.date ? <span>{moment(list.date).format('YYYY-MM-DD')}</span> : null;
			} else if (list.type === 'time') {
				return list.time ? <span>{moment(list.time).format('YYYY-MM-DD HH:mm:ss')}</span> : null;
			} else if (list.type === 'render') {
				return list.render;
			}
		};
		const getItemLabel = (label, tips) => {
			if (!label) return null;

			return tips ?
				<span>{label}
					<Tooltip title={tips} arrowPointAtCenter={true} placement='topLeft'>
						<Icon className={styles.tipIcon} type='question-circle' />
					</Tooltip>
				</span> : label;
		};
		const getItem = (isDoubleList, list, i, maxCol = 3) => {
			const { label, labelAttr, valueAttr, value, alone, tips, imgList, ...props } = list;
			const itemLablel = getItemLabel(label, tips);
			return (
				<Col key={i} xs={24} sm={24} md={24} xl={isDoubleList || alone ? 24 : 24 / maxCol} {...props}>
					<Row className={style.info_attr} key={i}>
						{
							itemLablel
								?
								<Col {...listLayout.normal.label}
									className={style.info_label} {...labelAttr}>{itemLablel}：
								</Col>
								: null
						}
						<Col
							className={style.info_value} {...valueAttr}>{value}
							{view(list)}
						</Col>
					</Row>
				</Col>
			);
		};
		const getFormItem = (isDoubleList, data, maxCol = 3) => {
			let colNum = 0, rowContent = [];
			data = data.filter(d => d);
			const formItem = data.map((list, i) => {
				if (!list) {
					return null;
				}
				const { alone } = list;
				if (alone) {
					const content = rowContent.map((item) => {
						return getItem(isDoubleList, data[item], item);
					});
					const otherContent = rowContent.length > 0 ? (<Row key={i - 1} span={24}>{content}</Row>) : null;
					colNum = 0;
					rowContent = [];
					return [
						otherContent,
						<Row key={i} span={24}>{getItem(isDoubleList, list, i)}</Row>,
					];
				} else {
					colNum = colNum + 1;
					rowContent.push(i);
					if (colNum === maxCol || i === data.length - 1) {
						const content = rowContent.map((item) => {
							return getItem(isDoubleList, data[item], item, maxCol);
						});
						colNum = 0;
						rowContent = [];
						return <Row key={i} span={24}>
							{content}
						</Row>;
					} else {
						if (rowContent[rowContent.length - 1] === list.length - 1) {
							const content = rowContent.map((item) => {
								return getItem(isDoubleList, data[item], item);
							});
							return <Row key={i} span={24}>
								{content}
							</Row>;
						}
					}
				}
			});
			return formItem;
		};

		const bgStyle = {
			background: '#ffffff',
			padding: '0 24px 12px 24px',
			marginBottom: blankLine ? 12 : 0,
		};

		return (
			<div style={bgStyle}>
				{
					title ?
						<div className={style.info_title}
							style={isDoubleList ? { marginBottom: '20px' } : { marginBottom: 0 }}>{title}
							{subData && <span className={style.create_time}>{subData.label}：{subData.value}</span>}
						</div>
						: null
				}
				<Row gutter={20}>
					{
						detailsData.map((item, index) => {
							return (
								(isDoubleList || index === 1 || detailsData.length === 1) &&
								<Col span={isDoubleList ? 12 : 24} key={index}>
									<div className={isDoubleList ? style.doubleList : ''}>
										{isDoubleList && <div className={style.info_th}>{item.title}</div>}
										<div className={style.info_cell}>
											{getFormItem(isDoubleList, item.data, item.maxCol)}
										</div>
									</div>
								</Col>
							);
						})
					}
				</Row>
			</div>
		);
	}
}

ListItem.defaultProps = {
	detailsData: [],
	title: '',
	isDoubleList: false,
	blankLine: true,
};
ListItem.propTypes = {
	detailsData: PropTypes.array,
	title: PropTypes.string,
	subData: PropTypes.object,
	isDoubleList: PropTypes.bool,
	dispatch: PropTypes.func,
	Layout: PropTypes.object,
	blankLine: PropTypes.bool, 		// 是否要空行
};

export default ListItem;

