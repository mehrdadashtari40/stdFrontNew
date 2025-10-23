import React from 'react';

import $ from 'jquery';
import jMoment from 'moment-jalaali';
import getAuthonticatedJSON from '../../../common/utils/functions/getAuthenticatedJSON';
import { getJSON } from '../../../common';
import { config } from '../../../config/config';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { withTranslation } from 'react-i18next';
import UpdateProfileForm from "../components/UpdateProfileForm";

class ViewUserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			User: [],
			Edit: false,
			Show: [],
			refresh: false,
		};
		this.handelShow = this.handelShow.bind(this);
	}
	componentDidMount() {
		let self = this;
		getAuthonticatedJSON(config.apiServer + 'userextend/get-my-uid').then(userUid => {
			getAuthonticatedJSON(config.apiServer + 'user/' + userUid, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access_token'),
					'Content-Type': 'application/json',
				},
			}).then(res => {
				self.setState({ Show: res });
				$('#UserBox').modal('show');
				self.SetData();
			});
		});
	}

	handelShow() {
		let self = this;
		getAuthonticatedJSON(config.apiServer + 'userextend/get-my-uid').then(userUid => {
			getJSON(config.apiServer + 'user/' + userUid, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access_token'),
					'Content-Type': 'application/json',
				},
			}).then(res => {
				self.setState({ Show: res });
				$('#UserBox').modal('show');
				self.SetData();
			});
		});
	}

	SetData() {
		let data = this.state.Show;
		$('input[name=usr_uid]').val(data['usr_uid']);
		$('input[name=usr_username]').val(data['usr_username']);
		$('input[name=usr_lastname]').val(data['usr_lastname']);
		$('input[name=usr_firstname]').val(data['usr_firstname']);
		$('input[name=usr_email]').val(data['usr_email']);
		$('input[name=usr_phone]').val(data['usr_phone']);
		$('input[name=usr_cellular]').val(data['usr_cellular']);
		$('input[name=usr_fax]').val(data['usr_fax']);
		$('input[name=usr_address]').val(data['usr_address']);
		$('input[name=usr_zip_code]').val(data['usr_zip_code']);
		$('input[name=usr_new_pass]').val(data['usr_new_pass']);
		$('input[name=usr_cnf_pass]').val(data['usr_cnf_pass']);
	}

	render() {
		return (
			<div id="content">
				{/* <div className="modal fade-in-up" id="UserBox" role="dialog" >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" id="UserBoxBody"> */}
				<UpdateProfileForm Data={this.state.Show} />
				{/* </div>
                    </div>
                </div> */}
			</div>
		);
	}
}
export default withTranslation()(ViewUserProfile);
