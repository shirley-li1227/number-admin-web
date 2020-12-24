import React from "react";

import DocumentTitle from "react-document-title";
import Favicon from "react-favicon";

import { PlatformName, PlatformFavicon } from "@/const";
import styles from "./index.less";

class UserLayout extends React.PureComponent {
	render() {
		const { children } = this.props;
		return (
			<DocumentTitle title={PlatformName}>
				<div className={styles.container}>
					<Favicon url={PlatformFavicon} />
					{children}
				</div>
			</DocumentTitle>
		);
	}
}

export default UserLayout;
