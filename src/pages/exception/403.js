import React from 'react';
import Link from 'umi/link';
import { localeMessage } from '@/utils';

const Exception403 = () => (
	<div>
		<h1>403</h1>
		<Link to="/">{localeMessage('noAuth.goBack')}</Link>
	</div>
);

export default Exception403;
