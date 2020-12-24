import React from 'react';

// components
import { Icon } from 'antd';

// css
import styles from './preview.less';
import { localeMessage } from '@/utils';

class PreviewImage extends React.Component {

	state = {
		showIndex: 0,
		data: [],
		isShow: false,
	}

	open = ({ data, showIndex }) => {
		this.setState({
			data: data || [],
			showIndex: showIndex || 0,
			isShow: true,
		});
	}

	onPre = (event) => {
		event.stopPropagation();
		event.preventDefault();

		const { data, showIndex } = this.state;
		let nextShowIndex = showIndex - 1;
		if (showIndex === 0) {
			nextShowIndex = data.length - 1;
		}
		this.setState({
			showIndex: nextShowIndex
		});
	}

	onNext = (event) => {
		event.stopPropagation();
		event.preventDefault();

		const { data, showIndex } = this.state;
		let nextShowIndex = showIndex + 1;
		if (showIndex === data.length - 1) {
			nextShowIndex = 0;
		}
		this.setState({
			showIndex: nextShowIndex
		});
	}

	onClose = () => {
		this.setState({
			isShow: false,
			data: [],
			index: 0,
		});
	}

	render() {
		const { data, showIndex, isShow } = this.state;
		const src = data.length && data[showIndex];
		return (
			<div className={`${styles.previewContainer} ${!isShow ? styles.hide : ''}`} onClick={this.onClose}>
				{
					data.length > 1 ?
						<Icon type="left-circle" className={styles.buttonLeft} onClick={this.onPre} />
						: null
				}
				{
					src ? <img src={src} alt={localeMessage('esPreviewImages.alt')} /> : null
				}
				{
					data.length > 1 ?
						<Icon type="right-circle" className={styles.buttonRight} onClick={this.onNext} />
						: null
				}
			</div>
		);
	}
}

export default PreviewImage;
