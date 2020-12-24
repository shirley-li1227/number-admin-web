import { BASEURL } from '@/const';

export default ({
	url,
	fileKey = 'id',
	fileId,
} = {}) => {
	const action = BASEURL + url;
	let form = document.createElement('form');
	form.style.display = 'none';
	form.setAttribute('method', 'get');
	form.setAttribute('action', action);
	form.setAttribute('target', '_blank');

	let fileInput = document.createElement('input');
	fileInput.setAttribute('name', fileKey);
	fileInput.value = fileId;

	form.appendChild(fileInput);
	document.body.appendChild(form);//将表单放置在web中
	form.submit();//表单提交
	form.remove();//移除该临时元素
};
