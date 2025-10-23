import React, {useState} from 'react';

import $ from 'jquery';
import jMoment from 'moment-jalaali';
import getAuthonticatedJSON from '../../../common/utils/functions/getAuthenticatedJSON';
import {getJSON, smallBox} from '../../../common';
import { config } from '../../../config/config';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { withTranslation } from 'react-i18next';
import UpdateProfileForm from "../components/UpdateProfileForm";
import putRequest from "../../../common/utils/functions/putRequest";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

function ChangePassword(props){
	const [validationState,SetValidationState] = useState({
		lowerCase:false,
		upperCase:false,
		number:false,
		specialChar:false,
		length:false
	});

	const onSubmit = (evt) =>{
		evt.preventDefault();
		const formData = Array.from(evt.target.elements)
			.filter(el => el.name)
			.reduce((a, b) => ({ ...a, [b.name]: b.value }), {});

		if(formData.usr_old_pass === ""){
			smallBox({
				title: props.t('Warning'),
				content: '<i>' + props.t('Old password can not be empty') + '</i>',
				color: '#cb8217',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
		} else if(formData.usr_cnf_pass !== formData.usr_new_pass){
			smallBox({
				title: props.t('Warning'),
				content: '<i>' + props.t('Password And Confirm Password Not equal') + '</i>',
				color: '#cb8217',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
		} else if(validationState.lowerCase && validationState.upperCase && validationState.number &&
			validationState.specialChar && validationState.length){
			let url = config.apiServer + 'arian/update-password';
			let data = {
				"old_password":formData.usr_old_pass,
				"password":formData.usr_new_pass
			};
			postAuthenticatedJSON(url,data).then(res => {
				if(parseInt(res.status)===200){
					smallBox({
						title: props.t('Successfully'),
						content: '<i>' + props.t('Password has been changed successfully') + '</i>',
						color: '#659265',
						iconSmall: 'fa fa-check fa-2x fadeInRight animated',
						timeout: 4000,
					});
					document.getElementById('change-password-form').reset();
				} else {
					smallBox({
						title: props.t('Warning'),
						content: res.message,
						color: '#cb8217',
						iconSmall: 'fa fa-check fa-2x fadeInRight animated',
						timeout: 4000,
					});
					document.getElementById('change-password-form').reset();
				}


			});



		} else {
			smallBox({
				title: props.t('Warning'),
				content: '<i>' + props.t('Password do not match validation rules') + '</i>',
				color: '#cb8217',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
		}
	}

	function validationPass(e) {
		let val = e.target.value;
		let lowercaseTest = /[a-z]/.test(val);
		let uppercaseTest = /[A-Z]/.test(val);
		let numberTest = /[0-9]/.test(val);
		let specialCharTest = /(@|#|\$|%|\^|!|&|\*|\)|\()/.test(val);
		let lengthTest = val.length > 8;
		SetValidationState({
			lowerCase:lowercaseTest,
			upperCase:uppercaseTest,
			number:numberTest,
			specialChar:specialCharTest,
			length:lengthTest
		});
	}

	return (
			<div id="content">
				<form id="change-password-form" className="smart-form" noValidate="novalidate" onSubmit={onSubmit}>
					<div className="modal-header">
						<h4 className="modal-title">{props.t('Update Password')}</h4>
					</div>
					<fieldset>
						<div className="row">
							<div className={'col-sm-6'}>
								<section className="col col-sm-12">
									<label className="input">
										{' '}
										<i className="icon-prepend fa fa-lock" />
										<input type="password" name="usr_old_pass" placeholder={props.t('Old Password')} />
									</label>
								</section>
								<section className="col col-sm-12">
									<label className="input">
										{' '}
										<i className="icon-prepend fa fa-lock" />
										<input type="password" name="usr_new_pass" placeholder={props.t('Password')} onChange={(e)=>validationPass(e)} />
									</label>
								</section>
								<section className="col col-sm-12">
									<label className="input">
										{' '}
										<i className="icon-prepend fa fa-lock" />
										<input
											type="password"
											name="usr_cnf_pass"
											placeholder={props.t('Password Confirmation')}
										/>
									</label>
								</section>
							</div>
							<div className={'col-sm-6 validation-container'}>
								<h4>{props.t('Your password must have')}</h4>
								<div className={'validation-holder'+(validationState.lowerCase === false?'':' passed')}>
									{validationState.lowerCase === false?<i className={'fa fa-circle'}></i>:<i className={'fa fa-check-circle'}></i>}
								 {props.t('Lowercase character')}
								</div>
								<div className={'validation-holder'+(validationState.upperCase === false?'':' passed')}>
									{validationState.upperCase === false?<i className={'fa fa-circle'}></i>:<i className={'fa fa-check-circle'}></i>}
								 {props.t('Uppercase character')}
								</div>
								<div className={'validation-holder'+(validationState.number === false?'':' passed')}>
									{validationState.number === false?<i className={'fa fa-circle'}></i>:<i className={'fa fa-check-circle'}></i>}
								 {props.t('Number')}
								</div>
								<div className={'validation-holder'+(validationState.specialChar === false?'':' passed')}>
									{validationState.specialChar === false?<i className={'fa fa-circle'}></i>:<i className={'fa fa-check-circle'}></i>}
								 {props.t('Special character')}
								</div>
								<div className={'validation-holder'+(validationState.length === false?'':' passed')}>
									{validationState.length === false?<i className={'fa fa-circle'}></i>:<i className={'fa fa-check-circle'}></i>}
								 {props.t('Length more than 8')}
								</div>
							</div>

						</div>
					</fieldset>

					<footer>
						<button type="submit" className="btn btn-success">
							<i className="fa fa-check"></i>
							{props.t('Submit')}
						</button>
					</footer>
				</form>
			</div>
		);
}
export default withTranslation()(ChangePassword);
