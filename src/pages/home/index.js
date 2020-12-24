import React from 'react';

class HomePage extends React.PureComponent {
	componentDidMount() {
		const redirect = sessionStorage.getItem('redirect');
		if (redirect) {
			sessionStorage.setItem('redirect', '');
			window.location.href = redirect;
		}
	}

	render() {
		return (
			<div>
				welcome!
			</div>
		);
	}
}

export default HomePage;
