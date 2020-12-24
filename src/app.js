import '@fortawesome/fontawesome-free/css/all.css';
import './styles/global.less';

export const dva = {
	config: {
		onError(err) {
			err.preventDefault();
			console.error(err.message);
		},
	},
};

