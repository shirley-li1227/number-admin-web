import React from "react";
import styles from "./index.less";
import { connect } from "dva";
import { Form, Input } from "antd";
import { EMAIL } from "@/utils/regExp";
import { localeMessage } from "@/utils";

const FormItem = Form.Item;

@connect(({ register }) => ({ register }))
class ThirdContent extends React.Component {
	checkPassword = (rule, value, callback) => {
		const formData = this.props.form.getFieldsValue();
		console.log(formData);
		if (value === formData.password) {
			callback();
		} else {
			callback(
				localeMessage("register.thirdContent.repassword.validator")
			);
		}
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const {
			register: { thirdForm = {} }
		} = this.props;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 }
			}
		};
		return (
			<Form className={styles.formWrapper}>
				<FormItem
					{...formItemLayout}
					className={styles.newPassword}
					label={localeMessage("profile.username.label")}
				>
					{getFieldDecorator("username", {
						rules: [
							{
								min: 4,
								message: localeMessage(
									"register.thirdContent.username.min",
									{ min: 4 }
								)
							},
							{
								max: 50,
								message: localeMessage(
									"register.thirdContent.username.max",
									{ max: 50 }
								)
							},
							{
								required: true,
								message: localeMessage(
									"register.thirdContent.username.required"
								)
							}
						],
						initialValue: thirdForm.username
					})(
						<Input
							placeholder={localeMessage(
								"register.thirdContent.username.placeholder",
								{ min: 4, max: 50 }
							)}
						/>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					className={styles.newPassword}
					label={localeMessage("profile.email.label")}
				>
					{getFieldDecorator("email", {
						rules: [
							{
								required: true,
								message: localeMessage("profile.email.required")
							},
							{
								pattern: EMAIL,
								message: localeMessage("common.test.email")
							}
						],
						initialValue: thirdForm.email
					})(
						<Input
							placeholder={localeMessage(
								"register.thirdContent.email.placeholder"
							)}
						/>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					className={styles.newPassword}
					label={localeMessage(
						"register.thirdContent.password.label"
					)}
				>
					{getFieldDecorator("password", {
						rules: [
							{
								min: 6,
								message: localeMessage(
									"register.thirdContent.password.min"
								)
							},
							{
								max: 20,
								message: localeMessage(
									"register.thirdContent.username.max",
									{ max: 20 }
								)
							},
							{
								required: true,
								message: localeMessage(
									"forgetPassword.newPassword.message"
								)
							},
							{
								whitespace: true,
								message: localeMessage("common.test.whitespace")
							}
						],
						initialValue: thirdForm.password
					})(
						<Input
							type="password"
							placeholder={localeMessage(
								"register.thirdContent.password.placeholder"
							)}
						/>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					className={styles.newPassword}
					label={localeMessage(
						"register.thirdContent.repassword.label"
					)}
				>
					{getFieldDecorator("repassword", {
						rules: [
							{
								required: true,
								message: localeMessage(
									"register.thirdContent.repassword.required"
								)
							},
							{ validator: this.checkPassword }
						],
						initialValue: thirdForm.repassword
					})(
						<Input
							type="password"
							placeholder={localeMessage(
								"register.thirdContent.repassword.placeholder"
							)}
						/>
					)}
				</FormItem>
			</Form>
		);
	}
}

const FirstForm = Form.create()(ThirdContent);
export default FirstForm;
