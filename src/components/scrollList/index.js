import React from 'react';
import PropTypes from 'prop-types';

import { Spin } from 'antd';
import { localeMessage } from '@/utils';

class ScrollList extends React.PureComponent {
	onScrollHandler = (event) => {
		const { onScroll, loading, isEnd } = this.props;
		const target = event.target,
			scrollTop = target.scrollTop,
			scrollHeight = target.scrollHeight,
			offsetHeight = target.offsetHeight;
		if(scrollHeight - scrollTop - offsetHeight < 80) {
			if(loading || isEnd) return;
			onScroll && onScroll();
		}
	}

	render() {
		const { children, style, loading, isEnd } = this.props;
		return (
			<div style={{ width: '100%', height: '100%', overflowY: 'auto', ...style}}
				onScroll={this.onScrollHandler}>
				{children}
				{ loading ? <div><Spin size="small" /><span style={{fontSize: 12, color: '#999'}}>{localeMessage('scrollList.loading')}...</span></div> : null }
				{ isEnd ? <div><span style={{fontSize: 12, color: '#999'}}>{localeMessage('scrollList.end')}...</span></div> : null }
			</div>
		);
	}
}

ScrollList.defaultProps = {
	style: {},
	onScroll: null,
	loading: false,
	isEnd: false
};

ScrollList.propTypes = {
	style: PropTypes.object,
	onScroll: PropTypes.func,
	loading: PropTypes.bool,
	isEnd: PropTypes.bool
};

export default ScrollList;
