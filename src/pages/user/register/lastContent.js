import React, { Component } from "react";
import { connect } from "dva";
import styles from "./index.less";
import { localeMessage } from "@/utils";
import { PlatformName } from "@/const";

@connect(({ register }) => ({ register }))
class LastContent extends Component {
	render() {
		const {
			register: { username = "" }
		} = this.props;
		return (
			<div>
				<div className={styles.lastPage}>
					<div>
						{localeMessage("register.lastContent.tipBefore")}
						<a>{username}</a>
						{localeMessage("register.lastContent.tipAfter", {
							name: PlatformName
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default LastContent;
