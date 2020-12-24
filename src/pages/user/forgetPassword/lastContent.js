import React, { Component } from 'react';
import {Icon } from 'antd';
import styles from './index.less';
import {localeMessage} from '@/utils';


class LastContent extends Component {
	render() {
		return (
			<div>
				<div className={styles.lastPage}>
					<Icon className={styles.successIcon} type="safety-certificate" />
					<div>{localeMessage('forgetPassword.finish.message')}</div>
				</div>
			</div>
		);
	}
}

export default LastContent;
