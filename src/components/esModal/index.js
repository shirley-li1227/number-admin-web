import React from "react";
import PropTypes from "prop-types";
import { Form, Modal, Button } from "antd";
import { getField } from "@/utils";

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 16 }
};

const ESModal = ({
	onOk,
	form: { getFieldDecorator, validateFields },
	forms,
	labelCol = formItemLayout.labelCol,
	wrapperCol = formItemLayout.wrapperCol,
	tip = "",
	...modalProps
}) => {
	const handleOk = callback => {
		validateFields((error, values) => {
			if (error) return;

			callback && callback(values);
		});
	};

	const modalOpts = {
		...modalProps,
		onOk: () => handleOk(onOk),
		footer:
			modalProps.footer &&
			modalProps.footer.map((obj, index) => (
				<Button
					key={index}
					type={obj.type}
					onClick={() => handleOk(obj.onClick)}
				>
					{obj.name}
				</Button>
			))
	};

	return (
		<Modal {...modalOpts}>
			<Form layout="horizontal">
				{forms.map((item, index) => {
					const { keyword, value, rules, style, ...itemProps } = item;
					return (
						<FormItem
							key={index}
							labelCol={labelCol}
							wrapperCol={wrapperCol}
							{...itemProps}
						>
							{getFieldDecorator(keyword, {
								initialValue: value,
								rules
							})(getField(item))}
						</FormItem>
					);
				})}
			</Form>
			{tip ? <div>{tip}</div> : null}
		</Modal>
	);
};

ESModal.defaultProps = {
	forms: []
};

ESModal.propTypes = {
	forms: PropTypes.array.isRequired,
	onOk: PropTypes.func
};

export default Form.create()(ESModal);
