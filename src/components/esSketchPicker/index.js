'use strict';

import React from 'react';
import { SketchPicker } from 'react-color';


import styles from './index.less';

class ESSketchPicker extends React.Component {
	state = {
		displayColorPicker: false,
	};

	handleClick = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	};

	handleClose = () => {
		this.setState({ displayColorPicker: false });
	};

	handChange = (value) => {
		const color = value.rgb;
		const { onChange } = this.props;
		onChange(`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
	}

	render() {
		const { displayColorPicker } = this.state;
		const { color, swatchStyle = {}, popStyle = {} } = this.props;

		return (
			<div className={styles.container}>
				<div className={styles.swatch} onClick={this.handleClick} style={swatchStyle}>
					<div className={styles.color} style={{ backgroundColor: color }} />
				</div>
				{
					displayColorPicker
						?
						<div className={styles.popover} style={popStyle}>
							<div className={styles.cover} onClick={this.handleClose} />
							<SketchPicker color={(color || '').toRGBA()} onChange={this.handChange} />
						</div>
						: null
				}
			</div>
		);
	}
}

export default ESSketchPicker;
