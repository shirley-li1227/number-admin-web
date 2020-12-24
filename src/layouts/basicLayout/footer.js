import React from 'react';
import { Layout, Icon } from 'antd';
import styles from './footer.less';
import { localeMessage } from '../../utils';

const { Footer } = Layout;
const FooterView = () => (
	<Footer className={styles.footerDiv}>
		<Icon type="copyright" /> {localeMessage('layouts.copyright')}
	</Footer>
);
export default FooterView;
