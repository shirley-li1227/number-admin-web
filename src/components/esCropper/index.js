import React from 'react';
import PropTypes from 'prop-types';
import request from '@/utils/request';

// components
import { Upload, Icon, message } from 'antd';
import ESPreview from '@/components/esPreviewImages';
import CropperModal from '@/components/modal/cropper';

import styles from './index.less';

class ESCropper extends React.PureComponent {
	static getDerivedStateFromProps(nextProps, state) {
		// Should be a controlled component.
		if(state.preValue != nextProps.value) {
			let value = [];
			if(typeof(nextProps.value) === 'string' && nextProps.value) {
				value.push(nextProps.value);
			}else if(Array.isArray(nextProps.value)) {
				value = nextProps.value;
			}
			value = value.map(obj => ({uid: obj, url: obj, status: 'done'}));

			return {
				preValue: nextProps.value,
				fileList: value,
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		let value = [];
		if(typeof(props.value) === 'string' && props.value) {
			value.push(props.value);
		}else if(Array.isArray(props.value)) {
			value = props.value;
		}
		this.state = {
			preValue: [],
			fileList: value.map(obj => ({uid: obj, url: obj, status: 'done'})),
			imageSrc: '',
			cropperModalVisible: false,
			loading: false,
			showKey: Date.now(),
		};
	}

	uploadButton = () => {
		const { fileList } = this.state;
		const { maxUploadNumber } = this.props;
		return (maxUploadNumber === 0 || maxUploadNumber > fileList.length ? <div><Icon type="plus"/></div> : null);
	};

	onRemove = () => {
		const { fileList } = this.state;
		const newFileList = fileList.filter(obj => obj.status === 'done');
		this.setState({fileList});
		this.triggerChange(newFileList);
	}

	triggerChange = (fileList) => {
		const { maxUploadNumber, onChange } = this.props;
		const list = fileList.map(obj => obj.url);
		const result = maxUploadNumber === 1 ? list.length > 0 ? list[0] : '' : list;
		onChange(result);
	}

	beforeUpload = (file) => {
		const { fileRules } = this.props;
		for(let i = 0; i < fileRules.length; i++) {
			let rule = fileRules[i];
			if(rule.maxFileSize && file.size > rule.maxFileSize) {
				message.error(rule.message);
				return;
			}else if(rule.fileExt && rule.fileExt.indexOf(file.type) === -1) {
				message.error(rule.message);
				return;
			}
		}

		const reader = new FileReader();
		// 因为读取文件需要时间,所以要在回调函数中使用读取的结果
		reader.onload = (e) => {
			this.setState({
				imageSrc: e.target.result, //cropper的图片路径
				cropperModalVisible: true, //打开控制裁剪弹窗的变量，为true即弹窗
				showKey: Date.now(),
			});
		};
		reader.readAsDataURL(file); //开始读取文件

		return false;
	}

	onPreview = (file) => {
		ESPreview.open({
			data: [file.url || file.thumbUrl]
		});
	}

	onCropperCancel = () => {
		this.setState({
			cropperModalVisible: false,
			imageSrc: '',
			loading: false,
		});
	}

	//保存裁剪后的图片
	onCropperSave = (file) => {
		const { fileList } = this.state;
		const { action } = this.props;
		let isAbort = false;

		this.setState({ loading: true });

		request(action, {
			method: 'post',
			data: {file},
			formData: true,
			ContentType: 'multipart/form-data',
		}).then(({code, data, errMsg}) => {
			if(isAbort) return;
			if(code === 0) {
				fileList.push({
					uid: data,
					url: data,
					status: 'done'
				});

				this.setState({fileList});
				this.triggerChange(fileList);
				this.onCropperCancel();
			}else {
				this.setState({fileList, loading: false});
				this.triggerChange(fileList);
				message.error(errMsg);
			}
		});
	}

	render() {
		const { fileList, cropperModalVisible, imageSrc, loading, showKey } = this.state;
		const { beforeText, cropper } = this.props;

		const cropperProps = {
			key: showKey,
			visible: cropperModalVisible,
			onCancel: this.onCropperCancel,
			onOk: this.onCropperSave,
			src: imageSrc,
			loading: loading,
			...cropper
		};

		return (
			<div>
				{
					beforeText ? <div className={styles.beforeText} dangerouslySetInnerHTML={{__html: beforeText}}></div> : null
				}
				<Upload
					listType="picture-card"
					fileList={fileList}
					beforeUpload={this.beforeUpload}
					onRemove={this.onRemove}
					onPreview={this.onPreview}
				>{this.uploadButton()}</Upload>

				<CropperModal { ...cropperProps } />
			</div>
		);
	}
}

ESCropper.defaultProps = {
	maxUploadNumber: 0,
	fileRules: [],
	onChange: () => null,
	beforeText: '',
	cropper: {},
};

ESCropper.propTypes = {
	action: PropTypes.string.isRequired,
	maxUploadNumber: PropTypes.number,
	fileRules: PropTypes.array,
	value: PropTypes.any,
	onChange: PropTypes.func,
	beforeText: PropTypes.string,
	cropper: PropTypes.object,
};

export default ESCropper;
