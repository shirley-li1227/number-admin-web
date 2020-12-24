import React from "react";
import PropTypes from "prop-types";

import Swiper from "swiper/dist/js/swiper";
import "swiper/dist/css/swiper.min.css";
import styles from "./index.less";

class ESSwiper extends React.PureComponent {
	swiperRef = null;

	componentDidMount() {
		this.updateSwiper();
	}

	componentDidUpdate() {
		this.updateSwiper();
	}

	updateSwiper() {
		const {
			data,
			autoplay,
			delay,
			speed,
			navigation,
			pagination,
			direction
		} = this.props;
		if (this.swiperRef) this.swiperRef.destroy();

		this.swiperRef = new Swiper(this.refs.mySwiper, {
			loop: data.length > 1,
			direction,
			// autoHeight: true,
			setWrapperSize: true,
			autoplay: autoplay
				? {
						delay,
						stopOnLastSlide: false,
						disableOnInteraction: false
				  }
				: false,
			// Disable preloading of all images
			preloadImages: false,
			// Enable lazy loading
			observer: true,
			lazy: true,
			speed,
			navigation: navigation
				? {
						nextEl: ".swiper-button-next",
						prevEl: ".swiper-button-prev"
				  }
				: false,
			pagination: pagination
				? {
						el: ".swiper-pagination",
						bulletElement: "li",
						hideOnClick: true,
						clickable: true
				  }
				: false
		});
	}

	render() {
		const { data, navigation, pagination } = this.props;

		return (
			<div
				className={`${styles.swiperContainer} swiper-container`}
				ref="mySwiper"
			>
				<div className="swiper-wrapper">
					{data.map((obj, index) => (
						<div key={index} className="swiper-slide">
							<img
								src={obj}
								alt=""
								style={{
									display: "block",
									width: "100%",
									height: "100%",
									objectFit: "contain"
								}}
							/>
						</div>
					))}
				</div>
				{navigation ? <div className="swiper-button-prev" /> : null}
				{navigation ? <div className="swiper-button-next" /> : null}
				{pagination ? <div className="swiper-pagination" /> : null}
			</div>
		);
	}
}

ESSwiper.defaultProps = {
	data: [],
	autoplay: true,
	delay: 3000,
	direction: "horizontal",
	speed: 500,
	pagination: false,
	navigation: false
};

ESSwiper.propTypes = {
	data: PropTypes.array.isRequired,
	autoplay: PropTypes.bool,
	delay: PropTypes.number,
	direction: PropTypes.string,
	speed: PropTypes.number,
	pagination: PropTypes.bool,
	navigation: PropTypes.bool
};

export default ESSwiper;
