import React from 'react';
import PropTypes from 'prop-types';

// components
import { Modal, Input, Button } from 'antd';

// css
import styles from './index.less';
import { localeMessage } from '@/utils';

class ModalMap extends React.Component {
	state = {
		address: ''
	}

	componentDidMount() {
		const { address } = this.props;
		setTimeout(() => {
			if (address) {
				this.initMap();
				this.geocoder.getLocation(address);
			} else {
				const geolocation = new window.qq.maps.Geolocation('EADBZ-QOI3X-ZE34L-ZKVN6-UDN4V-NHBEX', localeMessage('activityPhone.maskIntroduce.productName'));
				geolocation.getLocation((location) => {
					this.initMap();
					const coord = new window.qq.maps.LatLng(location.lat, location.lng);
					this.geocoder.getAddress(coord);
				}, () => {
					this.initMap();
				}, { timeout: 8000 });
			}

			this.setState({ address });
		}, 100);
	}

	initMap = () => {
		this.map = new window.qq.maps.Map(this.refs.mapContainer, {
			zoom: 15
		});

		//调用地址解析类
		this.geocoder = new window.qq.maps.Geocoder({
			complete: (result) => {
				this.map.setCenter(result.detail.location);
				if (this.marker) {
					this.marker.setPosition(result.detail.location);
				} else {
					this.marker = new window.qq.maps.Marker({
						map: this.map,
						position: result.detail.location
					});
				}

				this.addressInfo = result.detail;
				this.setState({
					address: result.detail.address
				});
			}
		});
		//地图监听点击事件
		window.qq.maps.event.addListener(
			this.map,
			'click',
			(event) => {
				const coord = new window.qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng());
				this.geocoder.getAddress(coord);
			}
		);
	}

	handlerOk = () => {
		const { onOk } = this.props;
		onOk(this.addressInfo);
	}

	handlerCancel = () => {
		const { onCancel } = this.props;
		onCancel();
	}

	onAddressChange = (e) => {
		this.setState({
			address: e.target.value
		});
	}

	onSearchHandler = () => {
		const { address } = this.state;
		this.geocoder.getLocation(address);
	}

	render() {
		const { address } = this.state;
		const modalProps = {
			visible: true,
			title: localeMessage('modal.mapSelect.title'),
			onOk: this.handlerOk,
			onCancel: this.handlerCancel,
			width: '70%',
			footer: null
		};

		return (
			<Modal className={styles.modalMap} {...modalProps}>
				<div className={styles.operation}>
					<Input placeholder={localeMessage('modal.address.placeholder')} value={address} onChange={this.onAddressChange} />
					<Button type="primary" onClick={this.onSearchHandler}>{localeMessage('common.btn.search')}</Button>
					<Button type="primary" onClick={this.handlerOk}>{localeMessage('modal.address.ok')}</Button>
				</div>
				<div ref="mapContainer" style={{ height: 400 }}></div>
			</Modal>
		);
	}
}


ModalMap.defaultProps = {
	address: ''
};

ModalMap.propTypes = {
	onOk: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	address: PropTypes.string
};

export default ModalMap;
