import React from "react";

import EventMananger from "@/utils/eventManager";

import styles from "./index.less";

class ScrollContainer extends React.PureComponent {
	state = {
		height: 1000
	};

	componentDidMount() {
		this.mainContainer = document.getElementById("mainContainer");
		if (this.mainContainer) {
			this.mainContainerPaddingBottom = this.mainContainer.style.paddingBottom;
			this.mainContainer.style.paddingBottom = 0;
		}
		this.setHeight();

		this.changeHeight = this.setHeight.bind(this);

		EventMananger.addEventListener("filterHeight", this.changeHeight);
	}

	componentWillUnmount() {
		if (this.mainContainer) {
			this.mainContainer.style.paddingBottom = this.mainContainerPaddingBottom;
		}

		EventMananger.removeEventListener("filterHeight", this.changeHeight);
	}

	setHeight() {
		if (this.refs.container) {
			const height =
				document.body.clientHeight -
				this.refs.container.offsetTop -
				104 -
				12;
			console.log(height);
			this.setState({
				height
			});
		}
	}

	render() {
		const { height } = this.state;
		const { children } = this.props;

		return (
			<div
				ref="container"
				className={styles.scrollContainer}
				style={{ height: height }}
			>
				{children}
			</div>
		);
	}
}

export default ScrollContainer;
