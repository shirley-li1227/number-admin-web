import React from "react";

import { Icon } from "antd";

const IconFont = Icon.createFromIconfontCN({
	scriptUrl: "./static/iconfont.js?v=2.0.27"
});

class ESIcon extends React.Component {
	render() {
		return <IconFont {...this.props} />;
	}
}

export default ESIcon;
