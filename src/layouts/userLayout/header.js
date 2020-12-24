import React from "react";
import styles from "./header.less";

import { PlatformName, PlatformLogo } from "@/const";

class UserHeader extends React.PureComponent {
	render() {
		const { children } = this.props;
		return (
			<div className={styles.top}>
				{/* <a>
					<img
						className={styles.logoIcon}
						src={PlatformLogo}
						alt=""
					/>
				</a> */}
				<div className={styles.title}>{PlatformName}</div>
				{children}
			</div>
		);
	}
}

export default UserHeader;
