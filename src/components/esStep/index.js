import React from 'react';
import PropTypes from 'prop-types';

import { Steps } from 'antd';

import styles from './index.less';

const Step = Steps.Step;

class ESStep extends React.Component {
	render() {
		const { data, current } = this.props;
		return (
			<div className={styles.stepContainer}>
				<Steps current={current}>
					{
						data.map((obj, index) => (
							<Step title={obj.title} key={index} />
						))
					}
				</Steps>
			</div>
		);
	}
}

ESStep.defaultProps = {
	data: [],
	current: 0,
};

ESStep.propTypes = {
	data: PropTypes.array,
	current: PropTypes.number,
};


export default ESStep;
