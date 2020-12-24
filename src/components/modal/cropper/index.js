import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import Cropper from 'react-cropper';
import '../../../../node_modules/cropperjs/dist/cropper.css';
import { dataURLtoFile, localeMessage } from '@/utils';

class CropperModal extends React.Component {
	onSave = () => {
		const { onOk } = this.props;
		const base64 = this.refs.cropper.getCroppedCanvas().toDataURL();
		if (base64) {
			onOk(dataURLtoFile(base64, `${Date.now()}.png`));
		}
	}

	render() {
		const {
			onCancel,
			loading,
			src,
			visible,
			ratio,
			minCropBoxWidth,
			minCropBoxHeight,
			...props
		} = this.props;

		return (
			<div>
				<Modal
					title={localeMessage('modal.cropper.title')}
					onCancel={onCancel}
					visible={visible}
					width={800}
					footer={[
						<Button key="confirm" type="primary" onClick={this.onSave} loading={loading}>{localeMessage('common.save')}</Button>,
						<Button key="cancel" onClick={onCancel}>{localeMessage('common.cancel')}</Button>
					]}
				>
					<Cropper
						style={{ 'height': 600 }}
						src={src}
						ref="cropper"
						// zoomable={false}
						aspectRatio={ratio}
						guides={true}
						viewMode={1}
						background={false} //是否显示马赛克
						rotatable={false} //是否旋转
						preview='.cropper-preview'
						minCropBoxWidth={minCropBoxWidth}
						minCropBoxHeight={minCropBoxHeight}
						{...props}
					/>
				</Modal>
			</div>
		);
	}
}

CropperModal.propTypes = {
	visible: PropTypes.bool.isRequired,
	onOk: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	src: PropTypes.string,
	ratio: PropTypes.number,
	loading: PropTypes.bool,
	minCropBoxWidth: PropTypes.number.isRequired,
	minCropBoxHeight: PropTypes.number.isRequired,
};

export default CropperModal;
