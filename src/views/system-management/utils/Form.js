import React from 'react';
import $ from 'jquery';
import getAuthonticatedJSON from '../../../common/utils/functions/getAuthenticatedJSON';
import { smallBox, SmartMessageBox } from '../../../common';
import { config } from '../../../config/config';
import postAuthenticatedJSON from '../../../common/utils/functions/postAuthenticatedJSON';
import { withTranslation } from 'react-i18next';
import moment from 'jalali-moment';
import jMoment from 'moment-jalaali';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';
import DatePicker from "react-modern-calendar-datepicker";
import { utils } from 'react-modern-calendar-datepicker';
import putAuthonticatedJSON from "../../../common/utils/functions/putAuthonticatedJSON";
import deleteAuthonticatedJSON from "../../../common/utils/functions/deleteAuthonticatedJSON";

const propTypes = {
	searchApiUrl: PropTypes.string,
	limit: PropTypes.number,
	defaultValue: PropTypes.object,
	actionOnSelectedOption: PropTypes.func,
};

const defaultProps = {
	limit: 25,
	defaultValue: null,
	actionOnSelectedOption: noop,
};


class Form extends React.Component {
	static propTypes = propTypes;
	static defaultProps = defaultProps;
	constructor(props) {
		super(props);
		this.state = {
			Update: false,
			UserId: '',
			role: '',
			status: this.props.status,
			successor: '',
			selData: [],
			selectedOption: null,
			inputValue: '',
			//selectedOption: this.props.defaultValue,
			actionOnSelectedOption: props.actionOnSelectedOption,
			due_date:null
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handelUpdate = this.handelUpdate.bind(this);
		this.handelDelete = this.handelDelete.bind(this);
		this.getOptions = debounce(this.getOptions.bind(this), 500);
		this.handleChange = this.handleChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			status: this.props.status,
		});
		if (newProps.Edit) {
			const userUID = newProps.Data.usr_uid;
			this.setState({ Update: true, UserId: userUID });
			this.setEditValueToField(newProps.Data);
		} else {
			this.setState({ Update: false, UserId: '' });
		}
		this.setState({ UserId: newProps.Data['usr_uid'] });


	}

	componentWillMount() {
		let self = this;
		getAuthonticatedJSON(config.apiServer + 'userextend/get-my-role').then(res => {
			self.setState({
				role: res,
			});
		});
	}

	populateRoleDropDown() {
		let items = [
			<option key={'PROCESSMAKER_OPERATOR'} value={'PROCESSMAKER_OPERATOR'}>
				{this.props.t('PROCESSMAKER_OPERATOR')}
			</option>,
		];
		getAuthonticatedJSON(config.apiServer + 'userextend/get-my-role').then(res => {
			switch (res) {
				case 'PROCESSMAKER_ADMIN':
					items.push(
						<option key={'PROCESSMAKER_ADMIN'} value={'PROCESSMAKER_ADMIN'}>
							{this.props.t('PROCESSMAKER_ADMIN')}
						</option>
					);
					items.push(
						<option key={'PROCESSMAKER_MANAGER'} value={'PROCESSMAKER_MANAGER'}>
							{this.props.t('PROCESSMAKER_MANAGER')}
						</option>
					);
					items.push(
						<option key={'PROCESSMAKER_DEPADMIN'} value={'PROCESSMAKER_DEPADMIN'}>
							{this.props.t('PROCESSMAKER_DEPADMIN')}
						</option>
					);
					break;
			}
		});

		return items;
	}

	setEditValueToField = data => {
		$('input[name="usr_username"]').val(data.usr_username);
		$('input[name="usr_firstname"]').val(data.usr_firstname);
		$('input[name="usr_lastname"]').val(data.usr_lastname);
		$('select[name="usr_role"]').val(data.usr_role);
		$('select[name="usr_status"]').val(data.usr_status);
		$('input[name="usr_email"]').val(data.usr_email);
		$('input[name="usr_phone"]').val(data.usr_phone);
		$('input[name="usr_due_date"]').val(jMoment(data.usr_due_date).format('jYYYY/jMM/jDD'));
	};

	setNullFiels = () => {
		$('input[name="usr_username"]').val('');
		$('input[name="usr_firstname"]').val('');
		$('input[name="usr_lastname"]').val('');
		$('select[name="usr_role"]').val('');
		$('select[name="usr_status"]').val('');
		$('input[name="usr_email"]').val('');
		$('input[name="usr_phone"]').val('');
		$('input[name="usr_new_pass"]').val('');
		$('input[name="usr_cnf_pass"]').val('');
	};

	onSubmit(evt) {
		evt.preventDefault();
		let self = this;
		if (this.state.Update && this.state.UserId) {
			const data = {
				usr_username: $('input[name="usr_username"]').val(),
				usr_firstname: $('input[name="usr_firstname"]').val(),
				usr_lastname: $('input[name="usr_lastname"]').val(),
				usr_role: $('input[name="usr_role"]').val(),
				usr_status: $('input[name="usr_status"]').val(),
				usr_email: $('input[name="usr_email"]').val(),
				usr_phone: $('input[name="usr_phone"]').val(),
				usr_replaced_by: this.state.successor,
				usr_due_date: moment
					.from($('input[name="usr_due_date"]').val(), 'fa', 'YYYY/MM/DD')
					.format('YYYY-MM-DD'),
			};
			putAuthonticatedJSON(config.apiServer + `users/${this.state.UserId}`, data).then(res => {
				self.props.getRefreshStatus();
			});
			smallBox({
				title: this.props.t('Successfully'),
				content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
				color: '#659265',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
			document.getElementById('new-user-form').reset();
			self.props.Refresh();
		} else {
			if (!this.checkPasswordLength()) return;

			if (!this.checkConfirmPassword()) return;

			let url = config.apiServer + 'user';
			const formData = Array.from(evt.target.elements)
				.filter(el => el.name)
				.reduce((a, b) => ({ ...a, [b.name]: b.value }), {});
			if (formData['usr_new_pass'] !== '' || formData['usr_cnf_pass'] !== '') {
				if (this.state.Update) {
					putAuthonticatedJSON(url + '/' + formData['usr_uid'], formData).then(res => {
						smallBox({
							title: this.props.t('Successfully'),
							content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
							color: '#659265',
							iconSmall: 'fa fa-check fa-2x fadeInRight animated',
							timeout: 4000,
						});
						document.getElementById('new-user-form').reset();
						$('#UserBox').modal('hide');
						self.props.Refresh();
					});
				} else {
					delete formData['usr_uid'];
					formData['usr_due_date'] = moment(formData['usr_due_date'], 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
					postAuthenticatedJSON(url, formData).then(res => {
						smallBox({
							title: this.props.t('Successfully'),
							content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
							color: '#659265',
							iconSmall: 'fa fa-check fa-2x fadeInRight animated',
							timeout: 4000,
						});
						document.getElementById('new-user-form').reset();
						self.props.AddUsers(res);
						$('#UserBox').modal('hide');
					}).catch(error=>{
						if(error.responseJSON && error.responseJSON.error !== undefined){
							var message = error.responseJSON.error.message;
							if(message.substr(0,13).toLowerCase()==='bad request: ')
								message = message.substr(13);
							smallBox({
								title: this.props.t('Failure'),
								content: '<i>' + this.props.t(message) + '</i>',
								color: '#d44950',
								iconSmall: 'fa fa-check fa-2x fadeInRight animated',
								timeout: 4000,
							});
						}
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
	}

	checkPasswordLength = () => {
		const password = $('#usr_new_pass').val();
		if (password.length >= 6) {
			return true;
		} else {
			$('#passwordValidationMsg').text(this.props.t('Minlength Password'));
			setTimeout(() => {
				$('#passwordValidationMsg').text('');
			}, 20000);
			return false;
		}
	};

	checkConfirmPassword = () => {
		const password = $('#usr_new_pass').val();
		const confirmPassword = $('#usr_cnf_pass').val();
		if (password == confirmPassword) {
			return true;
		} else {
			$('#confirmPasswordValidationMsg').text(this.props.t('Confirm Password'));
			setTimeout(() => {
				$('#confirmPasswordValidationMsg').text('');
			}, 20000);
			return false;
		}
	};

	handelDelete(e) {
		e.preventDefault();
		SmartMessageBox(
			{
				title: this.props.t('Delete confirm title'),
				content: this.props.t('Delete confirm content message'),
				buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']',
			},
			ButtonPressed => {
				if (ButtonPressed == this.props.t('Yes')) {
					let self = this;
					let userId = this.state.UserId;
					deleteAuthonticatedJSON(config.apiServer + 'user/' + userId).then(res => {
						if (res.statusCode === 400) {
							smallBox({
								title: this.props.t('Warning'),
								content:
									'<i>' + this.props.t('User can not deleted, user assign to the group') + '</i>',
								color: '#cb8217',
								iconSmall: 'fa fa-check fa-2x fadeInRight animated',
								timeout: 4000,
							});
							document.getElementById('new-user-form').reset();
							setTimeout(() => {
								self.props.getRefreshStatus();
							}, 500);
						} else if (res.statusCode === 200) {
							smallBox({
								title: this.props.t('Successfully'),
								content: '<i>' + this.props.t('Data has been deleted successfully') + '</i>',
								color: '#659265',
								iconSmall: 'fa fa-check fa-2x fadeInRight animated',
								timeout: 4000,
							});
							document.getElementById('new-user-form').reset();
							self.props.removeUser(userId);
						}
					});
				}
			}
		);
	}

	handelUpdate() {
		this.setState({ Update: true });
		this.props.Enable();
	}

	handelChangePassword = e => {
		e.preventDefault();
		$('#changePasswordBox').modal('show');
	};
	statusChange = e => {
		this.setState({
			status: e.target.value,
		});
	};
	successorChange = e => {
		this.setState({
			successor: e.target.value,
		});
	};

	getOptionValue = option => option.usr_uid;

	getOptionLabel = option => option.usr_firstname + ' ' + option.usr_lastname;

	handleChange = selectedOption => {
		this.setState({
			successor: selectedOption.usr_uid,
			selectedOption: selectedOption.usr_firstname + ' ' + selectedOption.usr_lastname,
		});

		this.state.actionOnSelectedOption(selectedOption.value);
	};

	async getOptions(inputValue) {
		if (!inputValue) {
			return [];
		}
		const response = await fetch(`${config.apiServer + 'users'}?filter=${inputValue}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token'),
				'Content-Type': 'application/json',
			},
		});
		const json = await response.json();
		return json;
	}

	handleInputChange(inputValue) {
		this.setState({ inputValue });
		return inputValue;
	}

	render() {
		const { placeholder } = this.props;
		let dueDateString = "";
		let dueDate = null;
		let self = this;
		if (this.state.due_date !== null) {
			dueDateString = moment(this.state.due_date, 'YYYY-MM-DD').format('jYYYY-jMM-jDD');
			dueDate = {
				year: parseInt(dueDateString.split('-')[0]),
				month: parseInt(dueDateString.split('-')[1]),
				day: parseInt(dueDateString.split('-')[2]),
			}
		}
		var option = [];
		this.state.selData.map(data => {
			option.push({ value: data.usr_uid, label: data.usr_firstname + ' ' + data.usr_lastname });
		});

		let passwordRow = null;
		if (!this.state.Update)
			passwordRow = (
				<div className="row">
					<section className="col col-6">
						<label>
							{this.props.t('Password')} <strong style={{ color: 'red' }}>*</strong>
						</label>
						<label className="input">
							<i className="icon-prepend fa fa-lock" />
							<input
								type="password"
								name="usr_new_pass"
								id="usr_new_pass"
								placeholder={this.props.t('Password')}
							/>
						</label>
						<div
							className="help-block text-danger"
							style={{ color: '#d44950' }}
							id="passwordValidationMsg"
						></div>
					</section>
					<section className="col col-6">
						<label>
							{this.props.t('Password Confirmation')} <strong style={{ color: 'red' }}>*</strong>
						</label>
						<label className="input">
							{' '}
							<i className="icon-prepend fa fa-lock" />
							<input
								type="password"
								name="usr_cnf_pass"
								id="usr_cnf_pass"
								placeholder={this.props.t('Password Confirmation')}
							/>
						</label>
						<div
							className="help-block text-danger"
							style={{ color: '#d44950' }}
							id="confirmPasswordValidationMsg"
						></div>
					</section>
				</div>
			);
		return (
			<form id="new-user-form" className="smart-form" noValidate="novalidate" onSubmit={this.onSubmit}>
				<div className="modal-header">
					{/*<button type="button" className="close" data-dismiss="modal">&times;</button>*/}
					<button type="button" className="close" id="modalClose">
						&times;
					</button>
					<h4 className="modal-title">{this.props.t('Add User')}</h4>
				</div>

				<div>
					<fieldset>
						<input type="hidden" name="usr_uid" id="usr_uid" />
						<div className="row">
							{/*<section className="modal_option_bar">*/}
							{/*	<div id="actions">*/}
							{/*		<nav className="modal_option_bx">*/}
							{/*			/!*<div className="modal_option_item">*!/*/}
							{/*			/!*<a onClick={this.handelUpdate} className="btn btn-info" >*!/*/}
							{/*			/!*<span className="fa fa-edit"/>   {  this.props.t('Edit') }*!/*/}
							{/*			/!*</a>*!/*/}
							{/*			/!*</div>*!/*/}
							{/*			<div className="modal_option_item">*/}
							{/*				<a onClick={this.handelDelete} className="btn btn-danger">*/}
							{/*					<span className="fa fa-remove" />*/}
							{/*					{this.props.t('Delete')}*/}
							{/*				</a>*/}
							{/*			</div>*/}
							{/*		</nav>*/}
							{/*	</div>*/}
							{/*</section>*/}
							<section className="col-sm-6">
								<label>
									{this.props.t('User Name')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="input">
									{' '}
									<i className="icon-prepend fa fa-user" />
									<input
										type="text"
										name="usr_username"
										id="usr_username"
										placeholder={this.props.t('User Name')}
									/>
								</label>
							</section>
							<section className="col-sm-6">
								<label>
									{this.props.t('Due Date')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="input">
								<DatePicker
									inline
									locale={'fa'}
									style={{width:'100%'}}
									onChange={(e) => {
										let date = moment(e.year + '/' + e.month + '/' + e.day, 'jYYYY/jMM/jDD').locale('en').format('YYYY-MM-DD');
										self.setState({
											due_date:date
										})
										// props.handle_variables('fromDate', date);
										// props.load_data_with_from_date(date)
									}}
									value={dueDate}
									minimumDate={utils('fa').getToday()}
									renderInput={({ref}) => (<>
										<i className="icon-prepend fa fa-calendar" />
										<input ref={ref}
										   disabled
											name="usr_due_date"
											id="usr_due_date"
										    value={dueDateString}
										    placeholder={'تاریخ انقضا'}
										    autoComplete={'off'}
										    className={'form-control search-input'}/>
									</>)}
									shouldHighlightWeekends
								/>
								</label>
							</section>
							<section className="col col-6">
								<label>
									{this.props.t('First Name')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="input">
									{' '}
									<i className="icon-prepend fa fa-user" />
									<input
										type="text"
										name="usr_firstname"
										id="usr_firstname"
										placeholder={this.props.t('First Name')}
									/>
								</label>
							</section>
							<section className="col col-6">
								<label>
									{this.props.t('Last Name')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="input">
									{' '}
									<i className="icon-prepend fa fa-user" />
									<input
										type="text"
										name="usr_lastname"
										id="usr_lastname"
										placeholder={this.props.t('Last Name')}
									/>
								</label>
							</section>
						</div>
						{/*  Password Row*/}
						{passwordRow}
						<div className="row">
							<section className="col col-6">
								<label>
									{this.props.t('Role')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="select">
									<select name="usr_role" id="usr_role">
										<option value="0" defaultValue disabled>
											{this.props.t('Role')}
										</option>
										<option
											value="PROCESSMAKER_ADMIN"
											disabled={this.state.role === 'PROCESSMAKER_ADMIN' ? false : true}
										>
											{this.props.t('Admin')}
										</option>
										<option value="PROCESSMAKER_OPERATOR">{this.props.t('Operator')}</option>
										<option
											value="PROCESSMAKER_MANAGER"
											disabled={this.state.role === 'PROCESSMAKER_ADMIN' ? false : true}
										>
											{this.props.t('Manager')}
										</option>
										<option
											value="PROCESSMAKER_DEPADMIN"
											disabled={this.state.role === 'PROCESSMAKER_ADMIN' ? false : true}
										>
											{this.props.t('DepAdmin')}
										</option>
									</select>{' '}
									<i />{' '}
								</label>
							</section>
							<section className="col col-6">
								<label>
									{this.props.t('Status')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="select">
									<select name="usr_status" id="usr_status" onChange={this.statusChange}>
										<option value="0" defaultValue disabled>
											{this.props.t('Status')}
										</option>
										<option value="ACTIVE">{this.props.t('Active')}</option>
										<option value="INACTIVE">{this.props.t('InActive')}</option>
										<option value="VACATION">{this.props.t('Vacation')}</option>
									</select>{' '}
									<i />{' '}
								</label>
							</section>
						</div>
						<div className="row">
							<section className="col col-6">
								<label>
									{this.props.t('Email')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="input">
									{' '}
									<i className="icon-prepend fa fa-envelope-o" />
									<input
										type="email"
										name="usr_email"
										id="usr_email"
										placeholder={this.props.t('Email')}
									/>
								</label>
							</section>
							<section className="col col-6">
								<label>
									{this.props.t('Phone')} <strong style={{ color: 'red' }}>*</strong>
								</label>
								<label className="input">
									{' '}
									<i className="icon-prepend fa fa-phone" />
									<input
										type="tel"
										name="usr_phone"
										id="usr_phone"
										placeholder={this.props.t('Phone')}
										data-smart-masked-input="(999) 999-9999"
									/>
								</label>
							</section>
						</div>
						{(this.state.status === 'ACTIVE' || this.state.status === '' ) ? null : (
							<div className="row">
								<section className="col col-6">
									<label>
										{this.props.t('کاربر جانشین')} <strong style={{ color: 'red' }}>*</strong>
									</label>
									<label className="input">
										{' '}
										<i className="icon-prepend fa fa-envelope-o" />
										<AsyncSelect
											cacheOptions
											value={this.statusChange.selectedOption}
											getOptionValue={this.getOptionValue}
											getOptionLabel={this.getOptionLabel}
											loadOptions={this.getOptions}
											placeholder={placeholder}
											onChange={this.handleChange}
										/>
									</label>
								</section>
							</div>
						)}
					</fieldset>
					<footer>
						<button type="submit" className="btn btn-success">
							<i className="fa fa-check"></i>
							{this.props.t('Submit')}
						</button>
					</footer>
				</div>
			</form>
		);
	}
}

export default withTranslation()(Form);
