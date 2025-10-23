import React from 'react';
import { connect } from 'react-redux';
import MD5 from '../../common/utils/functions/md5';
import { config } from '../../config/config';
import * as inbox from "../inbox/_redux/inboxRedux";
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
class BIDetail extends React.Component {
	currentMessage = null;

	componentDidMount() {
		this.props.closeSidebarCollapse("is_sidebar_collapsed",true);
	}

	render() {
		const path_name = this.props.location.pathname.includes('/')
			? this.props.location.pathname.replace('DashboardBi', 'Dashboard')
			: '/' + this.props.location.pathname.replace('DashboardBi', 'Dashboard');

		var url = '';

		if (this.props.location.search == '') {
			url = config.BIURL + path_name + '?token=' + MD5(MD5(localStorage.getItem('access_token')));
		} else {
			url =
				config.BIURL +
				path_name +
				this.props.location.search +
				'&token=' +
				MD5(MD5(localStorage.getItem('access_token')));
		}

		return (<div>
			<iframe
				sandbox="allow-downloads allow-top-navigation allow-same-origin allow-scripts
                  allow-forms allow-modals allow-popups allow-top-navigation allow-pointer-lock "
				style={{ width: '100%', height: '95vh', minHeight: '200px', border: '0' }}
				src={url}
				onLoad={(t, e) => this.loadCompleted(t, e)}
			>
				{' '}
			</iframe>
		</div>)
	}

	loadCompleted(t, e) {
	}
}

export default compose(
	withTranslation(),
	connect(null,inbox.actions)
)(BIDetail);
