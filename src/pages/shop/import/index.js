import React from 'react';
import { connect } from 'dva';
import ESTable from '@/components/esTable';
import styles from './index.less';
import { message } from 'antd';
import { formatDateTime, localeMessage } from '@/utils';
import { BASEURL } from '@/const';
import step from './img_arrow.png';
import success from './u20959.png';
import ESAuth from '@/components/esAuth';

@connect(({ orgCustomerImport, loading }) => ({
	orgCustomerImport,
	loading: loading.models['orgCustomerImport'],
}))

class orgFactoryImport extends React.Component {
	filename ;
	batchDownload = ({
		api,
		method,
		fileUrl,
		fileName
	} = {}) => {
		let form = document.createElement('form');
		form.style.display = 'none';
		form.setAttribute('target', '_blank');
		form.setAttribute('method', method);
		form.setAttribute('action', BASEURL + api);
		let fileInput = document.createElement('input');
		fileInput.setAttribute('name', 'fileUrl');
		fileInput.value = fileUrl;
		form.appendChild(fileInput);
		let nameInput = document.createElement('input');
		nameInput.setAttribute('name', 'fileName');
		nameInput.value = fileName;
		form.appendChild(nameInput);
		document.body.append(form);//将表单放置在web中
		form.submit();//表单提交
		form.remove();//移除该临时元素
	};
	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'orgCustomerImport/clearAll',
			payload: {},
		});
	}
	choosecsv = (event) => {
		console.log(event.target.files[0]);
		this.filename = event.target.files[0];
	}
	startImport = (event) => {
		const { dispatch } = this.props;
		if(this.filename) {
			dispatch({ type: 'orgCustomerImport/importCsv', payload: this.filename });
		} else {
			message.error(localeMessage('expenseCenter.import.selectFile'));
		}
	}
	download = (event) => {
		window.open(BASEURL + '/api/sys/orgDealer/downloadExcelTemplate', '_blank');
	}
	downloadbyName = (name, url) => {
		if(name.indexOf('.xlsx') > -1) {
			name = name.split('.xlsx')[0];
		}
		this.batchDownload({
			api: '/api/sys/file/download',
			method: 'post',
			fileName: name,
			fileUrl: url
		});
	}
	getHistory = (event) => {
		const { dispatch } = this.props;
		dispatch({ type: 'orgCustomerImport/getCsvImportRecord', payload: {} });
	}
	changeinput = () => {
		this.textInput.click();
	};
	render() {
		const { orgCustomerImport: { importResult, code, importType, recordlist, errMsg} } = this.props;
		let tabelHtml = '';
		let tabelHead = '';
		if(importResult && importResult.result && code === 101){
			let titlelist = importResult.result[0];
			let bodylist = importResult.result;
			const expandedColumns = {};
			const detail = [];
			titlelist.forEach((title, i) => {
				expandedColumns[i] = {
					title: title,
					dataIndex: i,
					key: i,
					sort: i,
				};
			});
			bodylist.forEach((body, i) => {
				if(i > 0){
					const bodyobj = {id: i};
					body.forEach((child, j) => {
						bodyobj[j] = child;
					});
					detail.push(bodyobj);
				}
			});
			const columns = Object.values(expandedColumns).sort((a, b) => a.sort - b.sort);
			const tableProps = {
				pagination: false,
				dataSource: detail||[],
				columns,
				rowKey: 'id'
			};
			tabelHead = <div className={styles.downResult}>{importResult.importResult} <a className={styles.downResultFileUrl} onClick={() => this.downloadbyName(localeMessage('expenseCenter.import.importEnd'), importResult.resultFileUrl)} >{localeMessage('expenseCenter.import.downImport')}</a></div>;
			tabelHtml = <ESTable {...tableProps} />;
		} else if(code === 0) {
			if(recordlist.length > 0) {
				const expandedColumns = {
					createUserName: {
						title: localeMessage('common.label.createUser'),
						dataIndex: 'createUserName',
						key: 'createUserName',
						sort: 1,
					},
					createTime: {
						title: localeMessage('common.label.createTime'),
						dataIndex: 'createTime',
						key: 'createTime',
						render: (text, record) => `${formatDateTime(record.createTime)}`,
						sort: 2,
					},
					importResult: {
						title: localeMessage('expenseCenter.import.importEnd'),
						dataIndex: 'importResult',
						key: 'importResult',
						sort: 3,
					},
					sourceFileName: {
						title: localeMessage('expenseCenter.import.importFile'),
						dataIndex: 'sourceFileName',
						key: 'sourceFileName',
						sort: 4,
						render: (text, record) => (
							<span><a onClick={() => this.downloadbyName(record.sourceFileName, record.sourceFileUrl)} >{record.sourceFileName}</a></span>
							// <span><a href={record.resultFileUrl} download={record.sourceFileName}>{localeMessage('product.download')}</a></span>
						),
					},
					finishTime: {
						title: localeMessage('expenseCenter.import.endTime'),
						dataIndex: 'finishTime',
						key: 'finishTime',
						render: (text, record) => `${formatDateTime(record.finishTime)}`,
						sort: 5,
					},
					resultFileUrl: {
						title: localeMessage('common.operate'),
						dataIndex: 'resultFileUrl',
						key: 'resultFileUrl',
						sort: 5,
						render: (text, record) => (
							<span><a onClick={() => this.downloadbyName(localeMessage('expenseCenter.import.importEnd'), record.resultFileUrl)} >{localeMessage('product.download')}</a></span>
							// <span><a href={record.resultFileUrl} download={record.sourceFileName}>{localeMessage('product.download')}</a></span>
						),
					}
				};
				const columns = Object.values(expandedColumns).sort((a, b) => a.sort - b.sort);

				const tableProps = {
					pagination: false,
					dataSource: recordlist||[],
					columns,
					rowKey: 'id',
				};
				tabelHtml = <ESTable {...tableProps} />;
			} else if( importResult.importResult !== undefined ) {
				tabelHead = <div className={styles.downResult}><img src={success} alt={localeMessage('expenseCenter.import.success')} />{importResult.importResult} <a className={styles.downResultFileUrl} onClick={() => this.downloadbyName(localeMessage('expenseCenter.import.importEnd'), importResult.resultFileUrl)} >{localeMessage('expenseCenter.import.downImport')}</a></div>;
			}
		}
		let importTypeValue = localeMessage('expenseCenter.import.startImport');
		if(importType === 222){
			importTypeValue = localeMessage('expenseCenter.import.importing');
		}
		return (
			<div>
				<div className={styles.importBackground}>
					<div className={styles.importTitle}>{localeMessage('expenseCenter.import.step')}：</div>
					<div>
						<div className={styles.importDownload}>
							<div className={styles.importflex}>
								<div className={styles.step1Pic}>1</div>
								<div className={styles.step1Text}>{localeMessage('expenseCenter.import.downMsg')}<br />{localeMessage('expenseCenter.import.downMsg1')}</div>
							</div>
							<ESAuth auth='sys_orgCustomer_downMould' render={localeMessage('expenseCenter.import.downMould')}>
								<button className={styles.downloadButton} onClick={this.download}>{localeMessage('expenseCenter.import.downMould')}.xlsx</button>
							</ESAuth>
						</div>
						<img className={styles.imgstep} src={step} alt={localeMessage('expenseCenter.import.firstStep')} />
						<div className={styles.importUpload}>
							<div className={styles.importflex}>
								<div className={styles.step1Pic}>2</div>
								<div className={styles.step2Text}>
									<div>{localeMessage('expenseCenter.import.selectNeedFile')}</div>
									<div className={styles.steplong}>{localeMessage('expenseCenter.import.selectFileMsg', {select: '.xlsx、5M'})}</div>
								</div>
							</div>
							<ESAuth auth='sys_orgCustomer_selectFile' render={localeMessage('expenseCenter.import.selectFileButton')}>
								<input className={styles.uploadButtonInput} type="file" onChange={this.choosecsv} ref={(input) => {
									this.textInput = input;
								}} />
								<button className={styles.uploadButton} onClick={this.changeinput} >{localeMessage('expenseCenter.import.selectFileButton')}</button>
							</ESAuth>
							<ESAuth auth='sys_orgCustomer_importFile' render={importTypeValue}>
								<button className={styles.submitButton} onClick={this.startImport}>{importTypeValue}</button>
							</ESAuth>
						</div>
						<div className={styles.clearAll}></div>
					</div>
				</div>
				<div className={styles.importBackground}>
					<div className={styles.downResult}>{localeMessage('expenseCenter.import.importEnd')} :
						<ESAuth auth='sys_orgCustomer_importHistory' render={localeMessage('expenseCenter.import.importHistory')}>
							<a className={styles.importHistory} onClick={this.getHistory}>{localeMessage('expenseCenter.import.importHistory')}</a>
						</ESAuth>
					</div>
					{tabelHead}
					{tabelHtml}
				</div>
			</div>
		);
	}
}


export default orgFactoryImport;
