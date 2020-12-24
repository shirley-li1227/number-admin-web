import React from 'react';
import Link from 'umi/link';
import { localeMessage } from '@/utils';

const Exception404 = () => (
	<div>
		<h1>404</h1>
		<Link to="/">{localeMessage('noAuth.goBack')}</Link>
	</div>
);

export default Exception404;
