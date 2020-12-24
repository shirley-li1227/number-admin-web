import React from 'react';
import { connect } from 'dva';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';

const Authorized = ({ children, app }) => {
	const { authList } = app;
	const isLogin = getAuthority();
	let comp;
	if (isLogin) {
		const authority = children.props.route.authority;
		if (authority) {
			const isMatch = authority.find(auth => authList.includes(auth));
			comp = isMatch ? children : <Redirect to="/noAuth" />;
		} else {
			comp = children;
		}
	} else {
		comp = <Redirect to="/user/login" />;
	}

	return comp;
};

function mapStateToProps({ app }) {
	return { app };
}
export default connect(mapStateToProps)(Authorized);
