import React, { Component } from "react";
import { connect } from "dva";
import router from "umi/router";
import Link from "umi/link";
import { Icon, Form, Button, Input, Row, Col } from "antd";
import { localeMessage, checkBrowser } from "@/utils";

import styles from "./index.less";

@connect(({ login, loading }) => ({
	login,
	submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tips: false
		};
	}

	componentDidMount() {
		const browserType = checkBrowser();
		if (browserType !== "chrome" && browserType !== "firefox") {
			this.setState({ tips: true });
		}
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { dispatch } = this.props;
				dispatch({
					type: "login/login",
					payload: {
						...values
					}
				});
			}
		});
	};

	getCaptchaImage = () => {
		const { dispatch } = this.props;
		dispatch({
			type: "login/getCaptchaImage"
		});
	};

	download = () => {
		router.push({ pathname: "/user/download" });
	};

	renderMiddleContent = () => {
		const {
			login: { captcha = "" },
			submitting,
			form
		} = this.props;
		const { tips } = this.state;
		const { getFieldDecorator } = form;

		return (
			<div className={styles.middle}>
				<div className={styles.middleInner}>
					<div className={styles.middleInnerRight}>
						<div className={styles.middleInnerRightLogin}>
							<div className={styles.loginHead}>LOGIN</div>
							<Form
								className={styles.loginMain}
								onSubmit={this.handleSubmit}
								ref={form => {
									this.loginForm = form;
								}}
							>
								<Form.Item>
									{getFieldDecorator("username", {
										rules: [
											{
												required: true,
												message: "请输入用户名"
											}
										]
									})(
										<Input
											prefix={<Icon type="user" />}
											placeholder="请输入用户名"
											className={styles.inputAccount}
										/>
									)}
								</Form.Item>

								<Form.Item>
									{getFieldDecorator("password", {
										rules: [
											{
												required: true,
												message: "请输入密码"
											}
										]
									})(
										<Input
											prefix={<Icon type="lock" />}
											type="password"
											placeholder="请输入密码"
											className={styles.inputPwd}
										/>
									)}
								</Form.Item>

								<Button
									className={styles.btnLogin}
									type="primary"
									htmlType="submit"
									loading={submitting}
								>
									登录
								</Button>
							</Form>
						</div>
					</div>
				</div>
			</div>
		);
	};

	render() {
		return (
			<div className={styles.loginContainer}>
				{this.renderMiddleContent()}
			</div>
		);
	}
}

export default Form.create()(LoginPage);
