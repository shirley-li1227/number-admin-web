import React, { PureComponent } from "react";
import { Menu, Icon } from "antd";
import styles from "./index.less";
import { getSildeMenuWidth, localeMessage } from "@/utils";
import RouterMap from "@/const/routerMap";

// components
import router from "umi/router";

import { PrivateEnum, PrivateId, PlatformShortName } from "@/const";

const SubMenu = Menu.SubMenu;

export default class SiderMenu extends PureComponent {
	state = {
		openKey: null
	};

	componentDidMount() {
		const { location, collapsed, dispatch } = this.props;
		const currentOpenKeys = JSON.parse(sessionStorage.getItem("openKeys"));
		this.setState({
			openKey: collapsed ? null : currentOpenKeys
		});
		dispatch({
			type: "app/getSelectKeys",
			payload: { pathname: location.pathname }
		});
	}

	changeLink = link => {
		// if(RouterMap[link] === undefined) {
		// 	console.log(link);
		// }
		return RouterMap[link] ? RouterMap[link] : link;
	};

	onClickMemu = path => {
		const { location } = this.props;
		const { openKey } = this.state;
		if (location.pathname !== path) {
			router.push({ pathname: path });
			sessionStorage.setItem("openKeys", JSON.stringify(openKey));
		}
	};

	getChildMenu = (child, parentCode) => {
		return child.map(item => {
			if (item.children.length > 0 && item.path === "/") {
				const code = parentCode + "/" + item.code;
				return (
					<SubMenu
						key={code}
						title={
							<span
								style={{
									display: "flex",
									alignItems: "center"
								}}
							>
								<span
									className={styles.subMenuTitle}
									style={{ paddingLeft: 10 }}
								>
									{item.name}
								</span>
							</span>
						}
					>
						{this.getChildMenu(item.children, code)}
					</SubMenu>
				);
			} else {
				const path = this.changeLink(item.path);
				return (
					<Menu.Item key={path}>
						<a
							className={styles.menuTitle}
							onClick={() => this.onClickMemu(path)}
						>
							{item.name}
						</a>
					</Menu.Item>
				);
			}
		});
	};

	getMenu = () => {
		const { data } = this.props;
		return data.map(item => (
			<SubMenu
				key={item.code}
				title={
					<span style={{ display: "flex", alignItems: "center" }}>
						<Icon type={item.icon} style={{ fontSize: 18 }} />
						<span className={styles.subMenuTitle}>{item.name}</span>
					</span>
				}
			>
				{this.getChildMenu(item.children, item.code)}
			</SubMenu>
		));
	};

	getOpenKeys = code => {
		if (code && code !== "/") {
			const temp = code.split("/");
			let resultStr = "";
			return temp.map(obj => {
				if (resultStr) {
					resultStr = resultStr + "/" + obj;
				} else {
					resultStr = obj;
				}
				return resultStr;
			});
		}
		return code ? [code] : [];
	};

	onOpenChange = openKeys => {
		const { openKey } = this.state;
		const curOpenKeys = this.getOpenKeys(openKey);
		let openKeysLevel = 1,
			curOpenKeysLevel = 1;
		openKeys.forEach(item => {
			if (item) {
				if (item.indexOf("/") > -1) {
					openKeysLevel = 2;
				}
			}
		});
		curOpenKeys.forEach(item => {
			if (item) {
				if (item.indexOf("/") > -1) {
					curOpenKeysLevel = 2;
				}
			}
		});
		let latestOpenKey;
		if (openKeys.length === 1 && curOpenKeysLevel === 2) {
			latestOpenKey = openKeys[0];
			if (openKeysLevel === 2) {
				latestOpenKey = "";
			}
		} else {
			latestOpenKey = openKeys.find(key => !curOpenKeys.includes(key));
		}
		this.setState({ openKey: latestOpenKey });
	};

	render() {
		const { openKey } = this.state;
		const { collapsed, logo, selectKeys } = this.props;
		const titleStyle = collapsed ? { width: 0 } : { width: 80 };
		const menuProps = {
			// selectedKeys: [selectKeys],
			mode: "inline",
			theme: "dark",
			// onOpenChange: this.onOpenChange,
			inlineIndent: 15,
			defaultSelectedKeys: ["shopList"],
			defaultOpenKeys: ["shop"]
		};

		return (
			<div
				className={styles.slideMenu}
				style={{ width: getSildeMenuWidth(collapsed) }}
			>
				<div
					className={styles.siderHeader}
					style={{ paddingLeft: collapsed ? 9 : 30 }}
				>
					<img src={logo} alt="logo" />
					<div style={titleStyle}>
						<span className={styles.title}>
							{PlatformShortName}
						</span>
					</div>
				</div>
				<Menu {...menuProps}>
					<SubMenu
						key="shop"
						title={
							<span>
								<Icon type="setting" />
								<span>门店管理</span>
							</span>
						}
					>
						<Menu.Item
							onClick={() => {
								router.push("/shop/list");
							}}
							key="shopList"
						>
							门店列表
						</Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		);
	}
}
