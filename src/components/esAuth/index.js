import { connect } from 'dva';
import { isMatchAuth } from '@/utils/authority';

const ESAuth = ({ children, app, auth, render = null }) => {
	const { authList } = app;
	const isMatch = isMatchAuth(auth, authList);
	return isMatch ? children : render;
};

function mapStateToProps({ app }) {
	return { app };
}
export default connect(mapStateToProps)(ESAuth);
