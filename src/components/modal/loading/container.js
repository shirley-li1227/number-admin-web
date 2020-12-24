'use strict';
import React from 'react';

import { Spin } from 'antd';

import styles from './container.less';

class LoadingModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			tip: ''
		};

		this.show = this.show.bind(this);
		this.close = this.close.bind(this);
	}

	close() {
		return new Promise((resolve, reject) => {
			this.setState({
				show: false,
			});

			setTimeout(() => {
				resolve();
			}, 300);
		});
	}


	show({ tip = 'Loading' }) {
		this.setState({
			show: true,
			tip,
		});
	}

	render() {
		let { show, tip } = this.state;
		return (
			<div className="help">
				{
					show ?
						<div className={styles.mask}>
							<div className={styles.container}>
								<Spin tip={tip}></Spin>
							</div>
						</div>
						: null
				}
			</div>
		);
	}
}

module.exports = LoadingModal;
