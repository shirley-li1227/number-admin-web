import React from 'react';
import { connect } from 'dva';

import styles from './index.less';
import { getSildeMenuWidth } from '@/utils';

@connect(({ app }) => ({
	app,
}))
class ESFooterButton extends React.PureComponent {
	render() {
		const {
			children,
			app: {
				collapsed,
			},
		} = this.props;
		const style = {
			left: getSildeMenuWidth(collapsed),
		};
		return (
			<div className={styles.esFooterButton} style={style}>{children}</div>
		);
	}
}

export default ESFooterButton;
