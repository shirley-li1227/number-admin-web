// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
	return localStorage.getItem('auth');
}

export function setAuthority(authority) {
	return localStorage.setItem('auth', authority);
}

export const isMatchAuth = (auth, authList) => {
	let isMatch = false;
	if(auth) {
		isMatch = authList.find(a => a === auth);
	}else {
		isMatch = true;
	}

	return isMatch;
};
