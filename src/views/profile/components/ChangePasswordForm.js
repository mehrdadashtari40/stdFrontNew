import React from 'react';
import { config } from '../../../config/config';
import { smallBox } from '../../../common';
import putRequest from '../../../common/utils/functions/putRequest';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';

class ChangePasswordForm extends React.Component {
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
		if (formData['usr_new_pass'] != formData['usr_cnf_pass']) {
			smallBox({
				title: this.props.t('Warning'),
				content: '<i>' + this.props.t('Password And Confirm Password Not equal') + '</i>',
				color: '#cb8217',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
		} else if (formData['usr_new_pass'] !== '' || formData['usr_cnf_pass'] !== '') {
			if (this.state.Update) {
				putRequest(url + '/' + formData['usr_uid'], {
					body: JSON.stringify(formData),
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('access_token'),
						'Content-Type': 'application/json',
					},
				}).then(res => {
					smallBox({
						title: this.props.t('Successfully'),
						content: '<i>' + this.props.t('Password has been changed successfully') + '</i>',
						color: '#659265',
						iconSmall: 'fa fa-check fa-2x fadeInRight animated',
						timeout: 4000,
					});
					document.getElementById('change-password-form').reset();
					$('#UserBox').modal('hide');
				});
			}
		} else {
			smallBox({
				title: this.props.t('Warning'),
				content: '<i>' + this.props.t('User Password Can Not Be Empty') + '</i>',
				color: '#cb8217',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
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
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-user" />
								<input
									type="text"
									name="usr_username"
									id="usr_username"
									placeholder={this.props.t('User name')}
								/>
							</label>
						</section>
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-envelope-o" />
								<input type="email" name="usr_email" placeholder={this.props.t('Email')} />
							</label>
						</section>
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-user" />
								<input type="text" name="usr_firstname" placeholder={this.props.t('First Name')} />
							</label>
						</section>
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-user" />
								<input type="text" name="usr_lastname" placeholder={this.props.t('Last Name')} />
							</label>
						</section>
					</div>
					<div className="row">
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-lock" />
								<input type="password" name="usr_new_pass" placeholder={this.props.t('Password')} />
							</label>
						</section>
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-lock" />
								<input
									type="password"
									name="usr_cnf_pass"
									placeholder={this.props.t('Password Confirmation')}
								/>
							</label>
						</section>
					</div>
					<div className="row">
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-fax" />
								<input
									type="tel"
									name="usr_fax"
									placeholder={this.props.t('Fax')}
									data-smart-masked-input="99-99999999"
								/>
							</label>
						</section>
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-phone" />
								<input
									type="tel"
									name="usr_phone"
									placeholder={this.props.t('Phone')}
									data-smart-masked-input="99-99999999"
								/>
							</label>
						</section>
					</div>
					<div className="row">
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-mobile" />
								<input
									type="tel"
									name="usr_cellular"
									placeholder={this.props.t('Cellular')}
									data-smart-masked-input="99999999999"
								/>
							</label>
						</section>
						<section className="col col-6">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-address-book" />
								<input
									type="text"
									name="usr_zip_code"
									placeholder={this.props.t('Zip Code')}
									data-smart-masked-input="99999999999"
								/>
							</label>
						</section>
					</div>
					<div className="row">
						<section className="col col-sm-12">
							<label className="input">
								{' '}
								<i className="icon-prepend fa fa-address-card" />
								<input
									type="tel"
									name="usr_address"
									placeholder={this.props.t('Address')}
									data-smart-masked-input="9999999999"
								/>
							</label>
						</section>
					</div>
				</fieldset>

				<footer>
					<button type="submit" className="btn btn-success">
						<i className="fa fa-check"></i>
						{this.props.t('Submit')}
					</button>
				</footer>
			</form>
		);
	}
}
export default withTranslation()(ChangePasswordForm);
