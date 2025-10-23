import React from 'react';
import { config } from '../../../config/config';
import { smallBox } from '../../../common';
import putRequest from '../../../common/utils/functions/putRequest';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

class UpdateProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Update: true,
			UserId: '',
		};
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentWillReceiveProps(newProps) {
		this.setState({ Update: true });
		this.setState({ UserId: newProps.Data['usr_uid'] });
	}

	onSubmit(evt) {
		evt.preventDefault();
		let self = this;
		let url = config.apiServer + 'user';
		const formData = Array.from(evt.target.elements)
			.filter(el => el.name)
			.reduce((a, b) => ({ ...a, [b.name]: b.value }), {});
		if (formData['usr_username'] === "" || formData['usr_email'] === "" || formData['usr_firstname'] === "" || formData['usr_lastname'] === "") {
			smallBox({
				title: this.props.t('Warning'),
				content: '<i>' + this.props.t('Please fill all required fields') + '</i>',
				color: '#cb8217',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
		} else  {
			let url = config.apiServer + 'arian/update-profile';
			postAuthenticatedJSON(url,formData).then(res => {
				if(parseInt(res.status)===200){
					smallBox({
						title: self.props.t('Successfully'),
						content: '<i>' + self.props.t('Your profile updated successfully') + '</i>',
						color: '#659265',
						iconSmall: 'fa fa-check fa-2x fadeInRight animated',
						timeout: 4000,
					});
				} else {
					smallBox({
						title: self.props.t('Warning'),
						content: res.message,
						color: '#cb8217',
						iconSmall: 'fa fa-check fa-2x fadeInRight animated',
						timeout: 4000,
					});
				}


			});
		}
	}

	render() {
		return (
			<form id="change-password-form" className="smart-form" noValidate="novalidate" onSubmit={this.onSubmit}>
				<div className="modal-header">

					<h4 className="modal-title">{this.props.t('Update Profile')}</h4>
				</div>
				<fieldset>
					<input type="hidden" name="usr_uid" id="usr_uid" />
					<div className="row">
						<section className="username-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-user" />
								<input style={{pointerEvents:"none" }}
									type="text" readOnly disabled 
									name="usr_username"
									id="usr_username"
									placeholder={this.props.t('username')+' *'}
								/>
							</label>
						</section>
						<section className="email-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-envelope-o" />
								<input type="email" name="usr_email" placeholder={this.props.t('Email')+' *'} />
							</label>
						</section>
						<section className="firstname-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-user" />
								<input type="text" readOnly disabled  name="usr_firstname" placeholder={this.props.t('First Name')+' *'} />
							</label>
						</section>
						<section className="lastname-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-user" />
								<input type="text" readOnly disabled name="usr_lastname" placeholder={this.props.t('Last Name')+' *'} />
							</label>
						</section>
					</div>
					{/*<div className="row">*/}
					{/*	<section className="col col-6">*/}
					{/*		<label className="input">*/}
					{/*			{' '}*/}
					{/*			<i className="icon-prepend fa fa-lock" />*/}
					{/*			<input type="password" name="usr_new_pass" placeholder={this.props.t('Password')} />*/}
					{/*		</label>*/}
					{/*	</section>*/}
					{/*	<section className="col col-6">*/}
					{/*		<label className="input">*/}
					{/*			{' '}*/}
					{/*			<i className="icon-prepend fa fa-lock" />*/}
					{/*			<input*/}
					{/*				type="password"*/}
					{/*				name="usr_cnf_pass"*/}
					{/*				placeholder={this.props.t('Password Confirmation')}*/}
					{/*			/>*/}
					{/*		</label>*/}
					{/*	</section>*/}
					{/*</div>*/}
					<div className="row">
						<section className="fax-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-fax" />
								<input
									type="tel"
									name="usr_fax"  readOnly disabled 
									placeholder={this.props.t('Fax')}
									data-smart-masked-input="99-99999999"
								/>
							</label>
						</section>
						<section className="phone-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-phone" />
								<input
									type="tel"
									name="usr_cellular"  readOnly disabled
									placeholder={this.props.t('Phone')}
									data-smart-masked-input="99-99999999"
								/>
							</label>
						</section>
					</div>
					<div className="row">
						<section className="cellular-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-mobile" />
								<input
									type="tel"
									name="usr_phone" readOnly disabled
									placeholder={this.props.t('Cellular')}
									data-smart-masked-input="99999999999"
								/>
							</label>
						</section>
						<section className="zip_code-section col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-address-book" />
								<input
									type="text"
									name="usr_zip_code" readOnly disabled
									placeholder={this.props.t('Zip Code')}
									data-smart-masked-input="99999999999"
								/>
							</label>
						</section>
					</div>
					<div className="row">
						<section className="address-section col col-sm-12">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-address-card" />
								<input
									type="tel"
									name="usr_address"  readOnly disabled
									placeholder={this.props.t('Address')}
									data-smart-masked-input="9999999999"
								/>
							</label>
						</section>
					</div>
				</fieldset>
					<footer className={"profile-update-footer"}>
						<button type="submit" className="btn btn-success">
							<i className="fa fa-check"></i>
							{this.props.t('Submit')}
						</button>
						<a href="#/change-password" className="btn btn-warning" style={{padding:"5px 22px"}}>
							<i className="fa fa-lock"></i>
							{this.props.t('Change Password')}
						</a>
					</footer>

			</form>
		);
	}
}
export default withTranslation()(UpdateProfileForm);