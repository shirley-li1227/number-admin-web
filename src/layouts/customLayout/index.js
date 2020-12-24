import React from "react";
import { connect } from "dva";
import DocumentTitle from "react-document-title";
import Favicon from "react-favicon";
//components
import { Layout } from "antd";

import { PlatformName, PlatformFavicon } from "@/const";

import PageLoading from "@/components/pageLoading";

class CustomLayout extends React.PureComponent {
	componentDidMount() {
		const { dispatch } = this.props;
		// dispatch({
		// 	type: "app/fetchMenu"
		// });

		// dispatch({
		// 	type: "app/fetchAuthList"
		// });
	}

	render() {
		const { children, loading } = this.props;

		const layout = <Layout>{children}</Layout>;

		return (
			<DocumentTitle title={PlatformName}>
				<div>{loading === false ? layout : <PageLoading />}</div>
			</DocumentTitle>
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
}))(CustomLayout);
