import React, { PureComponent } from "react";
import { connect } from "dva";

import { Layout, Badge, Icon, Dropdown, Menu } from "antd";
import EsSelectLang from "@/components/esSelectLang";
import ProfileModal from "@/pages/user/myProfile/profile";
import ChangePwd from "@/pages/user/myProfile/changePwd";

import { getSildeMenuWidth, localeMessage } from "@/utils";

import styles from "./header.less";

const { Header } = Layout;
class HeaderView extends PureComponent {
	handleMenuClick = ({ key }) => {
		const { dispatch } = this.props;
		if (key === "userCenter") {
			dispatch({
				type: "profile/changeParams",
				payload: { ProfileModalVisible: true }
			});
			return;
		}
		if (key === "changePw") {
			dispatch({
				type: "changePwd/changeParams",
				payload: { changePwdModalVisible: true }
			});
			return;
		}
		if (key === "logout") {
			dispatch({
				type: "login/logoutBtn"
			});
		}
	};
	profileHandleCancle = () => {
		const { dispatch } = this.props;
		dispatch({
			type: "profile/changeParams",
			payload: { ProfileModalVisible: false }
		});
	};

	changePwdHandleCancle = () => {
		const { dispatch } = this.props;
		dispatch({
			type: "changePwd/changeParams",
			payload: { changePwdModalVisible: false }
		});
	};

	render() {
		const {
			openMessageCenter,
			collapsed,
			onCollapse,
			unReadMsgCount,
			user,
			profile: { ProfileModalVisible },
			changePwd: { changePwdModalVisible }
		} = this.props;
		const ProfileModalProps = {
			visible: ProfileModalVisible,
			title: localeMessage("layouts.profile.title"),
			onCancel: this.profileHandleCancle,
			okText: localeMessage("common.save"),
			cancelText: localeMessage("common.cancel"),
			centered: true,
			width: 600,
			height: 530
		};
		const changePwdModalVisibleProps = {
			visible: changePwdModalVisible,
			title: localeMessage("layouts.changePwd.title"),
			onCancel: this.changePwdHandleCancle,
			okText: localeMessage("common.save"),
			cancelText: localeMessage("common.cancel"),
			centered: true,
			width: 600,
			height: 530
		};
		const menu = (
			<Menu
				className={styles.menu}
				selectedKeys={[]}
				onClick={this.handleMenuClick}
			>
				<Menu.Item key="userCenter">
					<Icon type="user" />
					<span>{localeMessage("layouts.profile.title")}</span>
				</Menu.Item>
				<Menu.Item key="changePw">
					<Icon type="setting" />
					<span>{localeMessage("layouts.changePwd.title")}</span>
				</Menu.Item>

				<Menu.Divider />
				<Menu.Item key="logout">
					<Icon type="logout" />
					<span>{localeMessage("layouts.logout.title")}</span>
				</Menu.Item>
			</Menu>
		);
		return (
			<Header
				className={styles.header}
				style={{ left: getSildeMenuWidth(collapsed) }}
			>
				<div className={styles.collapsed} onClick={onCollapse}>
					<Icon type={collapsed ? "menu-unfold" : "menu-fold"} />
				</div>

				<div className={styles.right}>
					{/* <span className={`${styles.action} ${styles.notice}`} onClick={openMessageCenter}>
						<Badge className={styles.badge} count={unReadMsgCount}>
							<Icon type='bell' />
						</Badge>
					</span> */}
					<a onClick={() => this.handleMenuClick({ key: "logout" })}>
						退出
					</a>
					{/* <Dropdown overlay={menu}>
						<span className={`${styles.action} ${styles.account}`}>
							<span className={styles.username}>
								{user.realName || user.username}
							</span>
							<Icon type="down" />
						</span>
					</Dropdown> */}

					{/* <div className={styles.lang}>
						<EsSelectLang />
					</div> */}
				</div>

				{ProfileModalVisible && <ProfileModal {...ProfileModalProps} />}
				{changePwdModalVisible && (
					<ChangePwd {...changePwdModalVisibleProps} />
				)}
			</Header>
		);
	}
}

export default connect(({ app, changePwd, profile }) => ({
	collapsed: app.collapsed,
	changePwd,
	profile
}))(HeaderView);
