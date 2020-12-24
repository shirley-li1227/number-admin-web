import { BASEURL } from '@/const';

export default ({
	url,
	method = 'post',
	queryParam,
	exportParam,
} = {}) => {
	let query = {};
	for (let key in queryParam) {
		if (queryParam[key] !== ' ' && queryParam[key] !== '' && queryParam[key] !== undefined && queryParam[key] !== null) {
			query[key] = queryParam[key];
		}
	}

	const action = BASEURL + url;
	let form = document.createElement('form');
	form.style.display = 'none';
	form.setAttribute('method', method);
	form.setAttribute('action', action);
	form.setAttribute('target', '_blank');

	let queryInput = document.createElement('input');
	queryInput.setAttribute('name', 'queryParam');
	let exportInput = document.createElement('input');
	exportInput.setAttribute('name', 'exportParam');

	const columnArr = exportParam.columns.map(col => ({
		name: col.key || col.dataIndex,
		title: col.title,
	}));

	exportParam.columns = columnArr;
	queryInput.value = JSON.stringify(query);
	exportInput.value = JSON.stringify(exportParam);

	console.log('queryParam', query);
	console.log('exportParam', exportParam);
	const param = {
		queryParam: query,
		exportParam,
	};
	console.log(JSON.stringify(param));

	form.appendChild(queryInput);
	form.appendChild(exportInput);

	document.body.appendChild(form);//将表单放置在web中
	form.submit();//表单提交
	form.remove();//移除该临时元素
};
