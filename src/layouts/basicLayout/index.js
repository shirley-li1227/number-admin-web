import React from "react";
import { connect } from "dva";

import DocumentTitle from "react-document-title";
import Favicon from "react-favicon";

import memoizeOne from "memoize-one";
import { getSildeMenuWidth } from "@/utils";

//components
import { Layout, Breadcrumb } from "antd";
import SiderMenu from "@/components/siderMenu";
// import Footer from './footer';
import Header from "./header";
import Context from "./menuContext";
import PageLoading from "@/components/pageLoading";
import Link from "umi/link";

import styles from "./index.less";
import router from "umi/router";

import { PlatformName, PlatformLogo, PlatformFavicon } from "@/const";
import { localeMessage } from "@/utils";

const { Content } = Layout;

class BasicLayout extends React.PureComponent {
	constructor(props) {
		super(props);
		this.getPageTitle = memoizeOne(this.getPageTitle);

		this.state = {
			pathname: ""
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// Should be a controlled component.
		if (nextProps.location.pathname !== prevState.pathname) {
			document.documentElement.scrollTop = 0;
		}

		return {
			pathname: nextProps.location.pathname
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		// dispatch({
		// 	type: 'app/fetchMenu',
		// });

		// dispatch({
		// 	type: 'app/fetchAuthList',
		// });

		// dispatch({
		// 	type: 'app/fetchUnReadMsgCount',
		// });

		// dispatch({
		// 	type: 'app/fetchUser',
		// });
	}

	getBreadcrumb = pathname => {
		const {
			route: { routes }
		} = this.props;
		const pathSnippets = pathname.split("/").filter(i => i);
		return pathSnippets.map((_, index) => {
			const path = "/" + pathSnippets.slice(0, index + 1).join("/");
			const route = routes.find(obj => obj.path === path);
			return route ? (
				<Breadcrumb.Item key={index}>
					{// 存在部分页面路径上会带上参数 直接点击会查询出所有的信息所以不让跳转
					// !route.level && pathname !== route.path ? <Link to={route.path}>{localeMessage(route.name)}</Link> : localeMessage(route.name)
					localeMessage(route.name)}
				</Breadcrumb.Item>
			) : null;
		});
	};

	getPageTitle = () => {
		return PlatformName;
	};

	getContext() {
		const { location } = this.props;
		return {
			location
		};
	}

	getMainLayoutStyle = () => {
		return {
			marginTop: 60
		};
	};

	getBreadcrumbStyle = () => ({
		position: "fixed",
		top: 64,
		width: "100%",
		height: 40,
		padding: "10px 20px",
		backgroundColor: "#fff",
		borderWidth: "1px",
		borderBottomStyle: "solid",
		borderColor: "#e6e6e6",
		zIndex: 999
	});

	getMainLayoutStyle = () => {
		const { collapsed } = this.props;
		return {
			marginLeft: getSildeMenuWidth(collapsed)
		};
	};

	getContentStyle = () => {
		return {
			padding: "15px 15px 50px 15px"
		};
	};

	handleMenuCollapse = () => {
		const { dispatch, collapsed } = this.props;
		dispatch({
			type: "app/changeState",
			payload: { collapsed: !collapsed }
		});
	};

	openMessageCenter = () => {
		router.push({
			pathname: "/system/messageCenter",
			query: {}
		});
	};

	render() {
		const {
			children,
			location: { pathname },
			menuList,
			loading
		} = this.props;
		const layout = (
			<Layout style={{ background: "#f5f5f5" }}>
				<SiderMenu
					data={menuList}
					logo={PlatformLogo}
					{...this.props}
				/>

				<Layout
					className={styles.mainLayout}
					style={{
						...this.getMainLayoutStyle()
					}}
				>
					<Header
						onCollapse={this.handleMenuCollapse}
						openMessageCenter={this.openMessageCenter}
						{...this.props}
					/>
					<Breadcrumb style={this.getBreadcrumbStyle()}>
						<Breadcrumb.Item>
							<Link to="/">
								{localeMessage("layouts.home.title")}
							</Link>
						</Breadcrumb.Item>
						{this.getBreadcrumb(pathname)}
					</Breadcrumb>
					<Content id="mainContainer" style={this.getContentStyle()}>
						{children}
					</Content>
					{/* <Footer /> */}
				</Layout>
			</Layout>
		);

		return (
			<React.Fragment>
				<DocumentTitle title={PlatformName}>
					<Context.Provider value={this.getContext()}>
						<Favicon url={PlatformFavicon} />
						{layout}
						{/* {loading === false ? layout : <PageLoading />} */}
					</Context.Provider>
				</DocumentTitle>
			</React.Fragment>
		);
	}
}

export default connect(({ app, loading }) => ({
	collapsed: app.collapsed,
	menuList: app.menuList,
	selectKeys: app.selectKeys,
	unReadMsgCount: app.unReadMsgCount,
	user: app.user,
	loading: loading.effects["app/fetchMenu"]
}))(BasicLayout);
