import React from "react";
import PropTypes from "prop-types";

import styles from "./index.less";

// components
import { InputNumber, Icon, Button } from "antd";
import { numberFormatter, labelPriceUnits, numberParser } from "@/utils";

import Big from "big.js";

class ESStepNumber extends React.Component {
	static getDerivedStateFromProps(nextProps) {
		// console.log(nextProps);
		// Should be a controlled component.
		if ("value" in nextProps) {
			return {
				...nextProps
			};
		}
		return null;
	}

	constructor(props) {
		super(props);

		const value = props.value || "";
		this.state = {
			value
		};
	}

	handlerInputChange = value => {
		this.changeValue(value);
	};

	minusValue = () => {
		const { value } = this.state;
		const { step, min } = this.props;
		if (value <= min) return;
		const x = new Big(value);
		this.changeValue(Number(x.minus(step)));
	};

	plusValue = () => {
		const { value } = this.state;
		const { step, max } = this.props;

		if (value >= max) return;

		const x = new Big(value);
		this.changeValue(Number(x.plus(step)));
	};

	triggerChange = value => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(value);
		}
	};

	changeValue = value => {
		if (!("value" in this.props)) {
			this.setState({ value });
		}
		this.triggerChange(value);
	};

	render() {
		const { value } = this.state;
		const { style, tip, min, max, precision } = this.props;
		const unit = labelPriceUnits(value);
		return (
			<div style={{ display: "inline-flex" }}>
				<div>
					<div
						style={{
							position: "absolute",
							top: -40,
							marginLeft: 60,
							color: "#b2b2b2",
							fontSize: 10
						}}
					>
						{unit}
					</div>
					<div
						className={styles.container}
						style={{ width: 200, display: "inline-flex" }}
					>
						<InputNumber
							className={styles.input}
							value={value}
							onChange={this.handlerInputChange}
							max={max}
							min={min}
							precision={precision}
							parser={numberParser}
							formatter={numberFormatter}
						/>
						<span className={styles.tip}>{tip}</span>
						<Button
							className={`${styles.button} ${styles.leftButton}`}
							onClick={this.minusValue}
						>
							<Icon type="minus" />
						</Button>
						<Button
							className={`${styles.button} ${styles.rightButton}`}
							onClick={this.plusValue}
						>
							<Icon type="plus" />
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

ESStepNumber.defaultProps = {
	style: {},
	step: 1,
	tip: "",
	max: 9999,
	min: 0.1,
	precision: 0
};

ESStepNumber.propTypes = {
	value: PropTypes.number,
	style: PropTypes.object,
	step: PropTypes.number,
	tip: PropTypes.string
};

export default ESStepNumber;
