import React from 'react';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { formatImageUrlSize } from '@/utils';

// components
import { Upload, Icon, message } from 'antd';
import ESPreview from '@/components/esPreviewImages';
import Sortable from 'react-sortablejs';
import styles from './index.less';


const getImageSize = ({ url } = {}) => {
	return new Promise((resolve) => {
		let img = new Image();
		img.onload = () => {
			resolve(img);
		};
		img.src = url;
	});
};

const getBase64 = (img) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => resolve(reader.result));
		reader.readAsDataURL(img);
	});
};
let tag = null;

class EsUpload extends React.PureComponent {
	static getDerivedStateFromProps(nextProps, state) {
		// Should be a controlled component.
		if (state.preValue !== nextProps.value) {
			let value = [];
			if (typeof (nextProps.value) === 'string' && nextProps.value) {
				value.push(nextProps.value);
			} else if (Array.isArray(nextProps.value)) {
				value = nextProps.value;
			}
			value = value.map(obj => ({ uid: obj, url: obj, status: 'done' }));

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
		if (typeof (props.value) === 'string' && props.value) {
			value.push(props.value);
		} else if (Array.isArray(props.value)) {
			value = props.value;
		}
		this.state = {
			preValue: [],
			fileList: value.map(obj => ({ uid: obj, url: obj, status: 'done' })),
			openSort: false,
			isLoading: false,
		};
	}

	uploadButton = () => {
		const { fileList, isLoading } = this.state;
		const { maxUploadNumber } = this.props;
		return ((maxUploadNumber === 0 || maxUploadNumber > fileList.length) && isLoading === false ? <div><Icon type="plus" /></div> : null);
	};

	onRemove = (file) => {
		const { fileList } = this.state;
		const newFileList = fileList.filter(obj => obj.uid !== file.uid);
		// this.setState({ fileList: newFileList });
		this.triggerChange(newFileList);
	};

	triggerChange = (fileList) => {
		const { maxUploadNumber, onChange } = this.props;
		const list = fileList.map(obj => obj.url);
		const result = maxUploadNumber === 1 ? list.length > 0 ? list[0] : '' : list;
		onChange(result);
	};

	onChange = ({ fileList }) => {
		this.setState({ fileList: fileList });
	};

	beforeUpload = (file) => {
		const { fileRules } = this.props;
		return new Promise(async (resolve, reject) => {
			for (let i = 0; i < fileRules.length; i++) {
				let rule = fileRules[i];
				if (rule.maxFileSize && file.size > rule.maxFileSize) {
					message.error(rule.message);
					reject();
					return;
				} else if (rule.fileExt && rule.fileExt.indexOf(file.type) === -1) {
					message.error(rule.message);
					reject();
					return;
				} else if (rule.validator) {
					const base64 = await getBase64(file);
					const img = await getImageSize({ url: base64 });
					rule.validator(img, (msg) => {
						if (msg) {
							message.error(msg);
							reject();
							return;
						}
					});
				}
			}
			resolve();
		});
	};

	customRequest = ({
		file,
		onSuccess,
	}) => {
		const { fileList } = this.state;
		const { action } = this.props;
		let isAbort = false;

		this.setState({
			isLoading: true,
		});

		request(action, {
			method: 'post',
			data: { file },
			formData: true,
			ContentType: 'multipart/form-data',
		}).then(({ code, data, errMsg }) => {
			if (isAbort) return;
			if (code === 0) {
				fileList.push({
					uid: data,
					url: data,
					status: 'done',
				});

				// onSuccess();

				// this.setState({ fileList });
				this.triggerChange(fileList);
			} else {
				// this.setState({ fileList });
				this.triggerChange(fileList);
				message.error(errMsg);
			}

			this.setState({
				isLoading: false,
			});

		});

		return {
			abort: () => {
				this.setState({
					isLoading: false,
				});
				isAbort = true;
				console.log('on abort');
			},
		};
	};

	onPreview = (file) => {
		const url = (file.url || file.thumbUrl).split('?imageView2')[0];
		ESPreview.open({
			data: [url]
		});
	};


	sortSwitch = (openSort) => {
		this.setState({ openSort });
		if (!openSort) {
			const { fileList } = this.state;
			this.triggerChange(fileList);
		}
	};

	onSortableUpdate = (evt) => {
		const oldIndex = evt.oldIndex;
		const newIndex = evt.newIndex;
		const { fileList } = this.state;
		const oldFile = fileList[oldIndex];
		fileList.splice(oldIndex, 1);
		fileList.splice(newIndex, 0, oldFile);
		this.setState({ fileList });
	};

	render() {
		const { fileList, openSort } = this.state;
		const { beforeText, imageSize, sort, showUploadList = true } = this.props;

		const files = fileList.map(file => ({ ...file, url: formatImageUrlSize(file.url, imageSize) }));
		let sortable = null;
		return (
			<div>
				{
					beforeText ? <div className={styles.beforeText}
						dangerouslySetInnerHTML={{ __html: beforeText }}></div> : null
				}
				{!openSort && <div>
					<Upload
						customRequest={this.customRequest}
						listType="picture-card"
						fileList={files}
						beforeUpload={this.beforeUpload}
						onRemove={this.onRemove}
						onChange={this.onChange}
						onPreview={this.onPreview}
						showUploadList={showUploadList}
					>{this.uploadButton()}</Upload>
					{sort && files.length > 1 && <Icon type="swap" onClick={() => this.sortSwitch(true)}
						style={{ color: '#33a3dc', cursor: 'pointer' }} />}
				</div>}

				{openSort && <div>
					<Sortable
						options={{
							onUpdate: this.onSortableUpdate,
						}}
						tag="div"
						ref={(c) => {
							if (c) {
								sortable = c.sortable;
							}
						}}
					>
						{files.map((item, index) => {
							return <div className={styles.sortItem} key={index}>
								<img src={item.url} alt="" /></div>;
						})}
					</Sortable>
					<Icon type="check" onClick={() => this.sortSwitch(false)}
						style={{ color: 'rgb(82, 196, 26)', cursor: 'pointer' }} />
				</div>}
			</div>
		);
	}
}

EsUpload.defaultProps = {
	maxUploadNumber: 0,
	fileRules: [],
	onChange: () => null,
	beforeText: '',
	imageSize: {
		w: '',
		h: 120,
	},
};

EsUpload.propTypes = {
	action: PropTypes.string.isRequired,
	maxUploadNumber: PropTypes.number,
	fileRules: PropTypes.array,
	value: PropTypes.any,
	onChange: PropTypes.func,
	beforeText: PropTypes.string,
	imageSize: PropTypes.object,
};

export default EsUpload;
