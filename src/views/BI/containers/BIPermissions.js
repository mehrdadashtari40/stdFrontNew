import React from 'react';
// import Form from '../components/PermissionForm';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';
import $ from 'jquery';
import * as Actions from '../BIActions';
import { connect } from 'react-redux';
import { config } from '../../../config/config';
import { SmartMessageBox, smallBox } from '../../../common';
import putRequest from '../../../common/utils/functions/putRequest';
import postRequest from '../../../common/utils/functions/postRequest';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import moment from "jalali-moment";
import MaterialDataTable from "../../../common/tables/components/MaterialDataTable";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import deleteAuthonticatedJSON from "../../../common/utils/functions/deleteAuthonticatedJSON";

class BIPermissions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Groups: [],
			Group: [],
			Edit: false,
			Show: [],
			refresh: false,
			GroupsMembers: [],
			GroupsMembersIds: [],
			GroupsMembersIdsConst: [],
			AssignUsers: [],
			AbaibleUsersIds: [],
			selectedForAssign: [],
			getUsesr: false,
		};
		this.handelIndex = this.handelIndex.bind(this);
		this.handelCreate = this.handelCreate.bind(this);
		this.handelShow = this.handelShow.bind(this);
		this.setGroupsMembers = this.setGroupsMembers.bind(this);
		this.getAvailableUsers = this.getAvailableUsers.bind(this);
		this.handelAssignUsers = this.handelAssignUsers.bind(this);
		this.assignUser = this.assignUser.bind(this);
		this.unAssignUser = this.unAssignUser.bind(this);
	}

	componentDidMount() {
		this.props.fetchAllPermissions(config.apiServer + 'biarian/bi-permission');
		var self = this;
		this.handelIndex();
		$('#GroupBox').on('hidden.bs.modal', function() {
			self.handelIndex();
			document.getElementById('new-permission-form').reset();
		});
		$('#AssignUser').change(function() {
			alert();
		});
		$(document).ready(function() {
			$(document).delegate('.deleteRow', 'click', function() {
				SmartMessageBox({
					title: this.props.t('Delete confirm title'),
					content: this.props.t('Delete confirm content message'),
					buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']'
				}, (ButtonPressed) => {
					if (ButtonPressed == this.props.t('Yes')) {
						


						const id = $(this).attr('rowId');
						deleteAuthonticatedJSON(config.apiServer + 'biarian/bi-permission/' + id).then((res) => {
							smallBox({
								title: this.props.t('Successfully'),
								content: "<i>" + this.props.t('Data has been saved successfully') + "</i>",
								color: "#659265",
								iconSmall: "fa fa-check fa-2x",
								timeout: 4000
							});

							// self.props.clearPermissions()
							self.props.fetchAllPermissions(config.apiServer + 'biarian/bi-permission');
						});

					
					}
				});

			});

			$(document).delegate('.updateRow', 'click', function() {
								const id = $(this).attr('rowId');

				$('#updateModal').modal('show');
				$('#PER_UID').val(id)
				self.props.fetchPermission(config.apiServer + 'biarian/bi-permission/' + $(this).attr('rowId'));
				// $('#PER_CODE').val(self.props.BI.Permission.PER_CODE);
				// $('#PER_NAME').val(self.props.BI.Permission.PER_NAME);
				// $('#PER_STATUS').val(self.props.BI.Permission.PER_STATUS);
			});
		});
	}
	onUpdate = (evt) =>{
		evt.preventDefault();
		let self = this;
        let url=config.apiServer + 'biarian/bi-permission';
		const formData = Array.from(evt.target.elements)
		.filter(el => el.name)
		.reduce((a, b) => ({...a, [b.name]: b.value}), {});
		// self.props.clearPermissions()
		self.props.fetchAllPermissions(config.apiServer + 'biarian/bi-permission');

	
            putRequest(url+'/'+formData['PER_UID'],
                {
                   
                    body: JSON.stringify(formData),
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem('access_token'),
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                smallBox({
                    title: this.props.t('Successfully'),
                    content: "<i>"+this.props.t('Data has been saved successfully')+"</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                document.getElementById("new-user-form").reset();
                $('#updateModal').modal('hide');
                self.props.Refresh();

            });
	}

	onSubmit =(evt) => {
        evt.preventDefault();
        let self = this;
        let url=config.apiServer + 'biarian/bi-permission';
        const formData = Array.from(evt.target.elements)
            .filter(el => el.name)
			.reduce((a, b) => ({...a, [b.name]: b.value}), {});
			// self.props.clearPermissions()
			self.props.fetchAllPermissions(config.apiServer + 'biarian/bi-permission');
            postRequest(url,
                {
                    body: JSON.stringify(formData),
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem('access_token'),
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                smallBox({
                    title: this.props.t('Successfully'),
                    content: "<i>"+this.props.t('Data has been saved successfully')+"</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                document.getElementById("new-user-form").reset();
                self.props.Refresh();

			})
			$('#createModal').modal('hide');

        
    }

	handelIndex() {
		this.setState({ Edit: false });
	}

	handelCreate() {
		$('input[name=PER_UID]').val('');
		$('input[name=grp_title]').val('');
		$('select[name=grp_status]').val('');
		$('#actions').hide();
		$('#createModal').modal('show');
		this.enableFields();
	}

	handelAssignUsers(selected) {
		let forAssign = selected.filter(data => {
			return this.state.GroupsMembersIdsConst.indexOf(data) < 0;
		});
		let forUnAssign = this.state.GroupsMembersIdsConst.filter(data => {
			return selected.indexOf(data) < 0;
		});
		this.setState({ GroupsMembersIds: selected });

		if (forAssign.length > 0) this.assignUser(forAssign);

		if (forUnAssign.length > 0) this.unAssignUser(forUnAssign);
	}

	handelShow(data) {
		getAuthonticatedJSON(config.apiServer + 'biarian/bi-permission/' + data['PER_UID']).then(res => {
			$('#actions').show();
			this.setState({ Show: res });
			$('#GroupBox').modal('show');
			this.SetData();
			this.disableFields();
		});
	}

	SetData() {
		let data = this.state.Show;
		$('input[name=PER_UID]').val(data['PER_UID']);
		$('input[name=grp_title]').val(data['grp_title']);
		$('select[name=grp_status]').val(data['grp_status']);
	}

	enableFields() {
		$('select[name=grp_status]').prop('disabled', false);
		$('input[name=grp_title]').prop('disabled', false);
		return false;
	}

	disableFields() {
		$('select[name=grp_status]').prop('disabled', true);
		$('input[name=grp_title]').prop('disabled', true);
		return false;
	}

	assignUser(users) {
		let permissionID = $('#PER_UID').val();
		postRequest(config.apiServer + 'group/batch-users', {
			body: JSON.stringify([
				{
					groupUid: permissionID,
					users: users,
				},
			]),
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token'),
				'Content-Type': 'application/json',
			},
		}).then(res => {
			smallBox({
				title: this.props.t('Successfully'),
				content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
				color: '#659265',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
		});
	}

	unAssignUser(unassigned) {
		let permissionID = $('#PER_UID').val();
		try {
			for (let i = 0; i < unassigned.length; i++) {
				let usr_uid = unassigned[i];
				deleteAuthonticatedJSON(config.apiServer + 'group/' + permissionID + '/user/' + usr_uid).then(res => {});
			}
			smallBox({
				title: this.props.t('Successfully'),
				content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
				color: '#659265',
				iconSmall: 'fa fa-check fa-2x fadeInRight animated',
				timeout: 4000,
			});
		} catch (e) {
		}
	}

	setGroupsMembers(data) {
		let a = [];
		data.map(d => {
			a.push(d.usr_uid);
		});
		this.setState({ GroupsMembersIds: a });
		this.setState({ GroupsMembersIdsConst: a });
		this.setState({ GroupsMembers: data });

		$('#GroupMembers').modal('show');
	}

	handelDelete() {
		SmartMessageBox(
			{
				title: this.props.t('Delete confirm title'),
				content: this.props.t('Delete confirm content message'),
				buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']',
			},
			ButtonPressed => {
				if (ButtonPressed == this.props.t('Yes')) {
					let permissionID = $('#PER_UID').val();
					deleteAuthonticatedJSON(config.apiServer + 'biarian/bi-permission/' + permissionID).then(res => {
						smallBox({
							title: this.props.t('Successfully'),
							content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
							color: '#659265',
							iconSmall: 'fa fa-check fa-2x fadeInRight animated',
							timeout: 4000,
						});
						$('#GroupBox').modal('hide');
					});
				}
			}
		);
	}

	getAvailableUsers() {
		let permissionID = $('#PER_UID').val();
		let self = this;
		getAuthonticatedJSON(config.apiServer + 'group/' + permissionID + '/available-users').then(res => {
			let AssignUsers = [];
			let AssignUsersids = [];
			res.map(item => {
				AssignUsers.push({
					value: item.usr_uid,
					label: '(' + item.usr_username + ')' + ' ' + item.usr_firstname + ' ' + item.usr_lastname,
				});
				AssignUsersids.push(item.usr_uid);
			});
			self.state.GroupsMembers.map(item => {
				AssignUsers.push({
					value: item.usr_uid,
					label: '(' + item.usr_username + ')' + ' ' + item.usr_firstname + ' ' + item.usr_lastname,
				});
			});
			self.setState({ AssignUsers: AssignUsers });
			self.setState({ AbaibleUsersIds: AssignUsersids });
			$('#AssignUsers').modal('show');
		});
	}

	closeAssignUserModal = () => {
		$('#AssignUsers').modal('hide');
		let status = !this.state.getUsesr;
		this.setState({ getUsesr: status });
	};

	render() {
		var self = this;
		let data = null;
			data = this.props.Permissions;
		
		return (
			<>
				<Card id="content">
					<CardContent>
						<h5 className={'table-header-title'}>
							<i className={"fal fa-table table-header-icon"}></i>
							مدیریت BI - دسترسی ها
							<button className="btn btn_inbox" onClick={() => this.handelCreate()}>
								<i className="fa fa-plus"></i>
								<span>{this.props.t('New Permission')}</span>
							</button>
						</h5>
						<MaterialDataTable
							items={this.props.Permissions}
							columns={[
								{
									dataField: 'PER_UID',
									text: this.props.t('PER_UID'),
									filterable: 'PER_UID'
								},
								{
									dataField: 'PER_CODE',
									text: this.props.t('PER_CODE'),
									filterable: 'PER_CODE'
								},
								{
									dataField: 'PER_STATUS',
									text: this.props.t('PER_STATUS'),
									filterable: 'PER_STATUS',
									filterOptions: [{
										key: '1',
										text: 'فعال'
									}, {
										key: '0',
										text: 'غیر فعال'
									}
									],
									formatter: function (cell, item) {
										return item.PER_STATUS === '1' ? <span className='label label-success'>فعال</span> :
											<span className='label label-danger'>غیر فعال</span>
									}
								},
								{
									dataField: 'PER_CREATE_DATE',
									filterable: 'PER_CREATE_DATE',
									text: this.props.t('PER_CREATE_DATE'),
									formatter: function (cell, item) {
										if(item.PER_CREATE_DATE === null)
											return "";
										return moment(item.PER_CREATE_DATE).format('jYYYY/jMM/jDD HH:mm:ss');
									}
								},
								{
									dataField: 'PER_UPDATE_DATE',
									filterable: 'PER_UPDATE_DATE',
									text: this.props.t('PER_UPDATE_DATE'),
									formatter: function (cell, item) {
										if(item.PER_UPDATE_DATE === null)
											return "";
										return moment(item.PER_UPDATE_DATE).format('jYYYY/jMM/jDD HH:mm:ss');
									}
								},
								{
									dataField: 'actions',
									text: 'عملیات',
									formatter: function (cell, item) {
										return (<div className={'table-actions'}>
											<i className={'fas fa-edit'}
											   onClick={() => {
												   const id = item.ROL_UID;
												   $('#updateModal').modal('show');
												   $('#PER_UID').val(id)
												   self.props.fetchPermission(config.apiServer + 'biarian/bi-permission/' + $(this).attr('rowId'));
											   }}
											></i>
											<i className={'fas fa-trash'}
											   onClick={() => {
												   SmartMessageBox({
													   title: self.props.t('Delete confirm title'),
													   content: self.props.t('Delete confirm content message'),
													   buttons: '[' + self.props.t('No') + '][' + self.props.t('Yes') + ']'
												   }, (ButtonPressed) => {
													   if (ButtonPressed == self.props.t('Yes')) {



														   const id = item.ROL_UID;
														   deleteAuthonticatedJSON(config.apiServer + 'biarian/bi-permission/' + id).then((res) => {
															   smallBox({
																   title: self.props.t('Successfully'),
																   content: "<i>" + self.props.t('Data has been saved successfully') + "</i>",
																   color: "#659265",
																   iconSmall: "fa fa-check fa-2x",
																   timeout: 4000
															   });

															   // self.props.clearPermissions()
															   self.props.fetchAllPermissions(config.apiServer + 'biarian/bi-permission');
														   });


													   }
												   });
											   }}
											></i>
										</div>)
									}
								},
							]}
						/>

					</CardContent>
				</Card>
				{/* Start of Update Modal*/}
				<div id="updateModal" className="modal fade" permission="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal">
									&times;
								</button>
								<h4 className="modal-title"> {this.props.t('Edit Permission')}</h4>
							</div>
							<div className="modal-body">
								<form
									id="new-user-form"
									className="smart-form"
									noValidate="novalidate"
									onSubmit={this.onUpdate}
								>
									<fieldset>
										<input type="hidden" name="PER_UID" id="PER_UID" />
										<div className="row">
											<section className="modal_option_bar">
												<div id="actions">
													<nav className="modal_option_bx">
														{/* <div className="modal_option_item">
						<a onClick={this.getGroupMembers} className="btn btn-info" >
							<span className="fa fa-users"/>{  this.props.t('Users') }
							</a>
					  </div>   */}
														<div className="modal_option_item">
															<a onClick={this.handelUpdate} className="btn btn-warning">
																<span className="fa fa-edit" />{' '}
																{this.props.t('Edit')}
															</a>
														</div>
														<div className="modal_option_item">
															<a onClick={this.handelDelete} className="btn btn-danger">
																<span className="fa fa-remove" />
																{this.props.t('Delete')}
															</a>
														</div>
													</nav>
												</div>
											</section>
											<section className="col-sm-6">
												<label className="input">
													{' '}
													<i className="icon-prepend fa fa-user" />
													<input
														type="text"
														name="PER_CODE"
														id="PER_CODE"
														placeholder={this.props.t('PER_CODE')}
													/>
												</label>
											</section>
											<section className="col-sm-6">
												<label className="input">
													{' '}
													<i className="icon-prepend fa fa-user" />
													<input
														type="text"
														name="PER_NAME"
														id="PER_NAME"
														placeholder={this.props.t('PER_NAME')}
													/>
												</label>
											</section>
											<section className="col-sm-6">
												<label className="select">
													<select name="PER_STATUS">
														<option value="-1" defaultValue disabled>
															{this.props.t('Status')}
														</option>
														<option value="1">{this.props.t('Active')}</option>
														<option value="0">{this.props.t('InActive')}</option>
													</select>{' '}
													<i />{' '}
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

						</div>
					</div>
				</div>
				</div>
				{/* <div className="modal-footer">
								<button
									type="button btn btn-success"
									className="btn btn-default"
									data-dismiss="modal"
									onClick={this.handelAssignUsers}
								>
									{this.props.t('Submit')}
								</button>
							</div> */}
				{/* End of of Update Modal*/}
				{/* Start of AddNew  Modal*/}
				<div id="createModal" className="modal fade" permission="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal">
									&times;
								</button>
								<h4 className="modal-title"> {this.props.t('Add New Permission')}</h4>
							</div>
							<div className="modal-body">
								<form
									id="new-user-form"
									className="smart-form"
									noValidate="novalidate"
									onSubmit={this.onSubmit}
								>
									<fieldset>
										<input type="hidden" name="PER_UID" id="PER_UID" />
										<div className="row">
											<section className="modal_option_bar">
												<div id="actions">
													<nav className="modal_option_bx">
														{/* <div className="modal_option_item">
						<a onClick={this.getGroupMembers} className="btn btn-info" >
							<span className="fa fa-users"/>{  this.props.t('Users') }
							</a>
					  </div>   */}
														
										
													</nav>
												</div>
											</section>
											<section className="col-sm-6">
												<label className="input">
													{' '}
													<i className="icon-prepend fa fa-user" />
													<input
														type="text"
														name="PER_CODE"
														id="PER_CODE"
														placeholder={this.props.t('PER_CODE')}
													/>
												</label>
											</section>
											<section className="col-sm-6">
												<label className="input">
													{' '}
													<i className="icon-prepend fa fa-user" />
													<input
														type="text"
														name="PER_NAME"
														id="PER_NAME"
														placeholder={this.props.t('PER_NAME')}
													/>
												</label>
											</section>
											<section className="col-sm-6">
												<label className="select">
													<select name="PER_STATUS">
														<option value="-1" defaultValue disabled>
															{this.props.t('Status')}
														</option>
														<option value="1">{this.props.t('Active')}</option>
														<option value="0">{this.props.t('InActive')}</option>
													</select>{' '}
													<i />{' '}
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

						</div>
					</div>
				</div>
				</div>
				{/* <div className="modal-footer">
								<button
									type="button btn btn-success"
									className="btn btn-default"
									data-dismiss="modal"
									onClick={this.handelAssignUsers}
								>
									{this.props.t('Submit')}
								</button>
							</div> */}
				{/* End of of AddNew Modal*/}

				<div id="GroupBox" className="modal fade" permission="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal">
									&times;
								</button>
								<h4 className="modal-title"> {this.props.t('Group Details')}</h4>
							</div>
							<div className="modal-body">
								<form
									id="new-user-form"
									className="smart-form"
									noValidate="novalidate"
									onSubmit={this.onSubmit}
								>
									<fieldset>
										<input type="hidden" name="PER_UID" id="PER_UID" />
										<div className="row">
											<section className="modal_option_bar">
												<div id="actions">
													<nav className="modal_option_bx">
														{/* <div className="modal_option_item">
						<a onClick={this.getGroupMembers} className="btn btn-info" >
							<span className="fa fa-users"/>{  this.props.t('Users') }
							</a>
					  </div>   */}
														<div className="modal_option_item">
															<a onClick={this.handelUpdate} className="btn btn-warning">
																<span className="fa fa-edit" />{' '}
																{this.props.t('Edit')}
															</a>
														</div>
														<div className="modal_option_item">
															<a onClick={this.handelDelete} className="btn btn-danger">
																<span className="fa fa-remove" />
																{this.props.t('Delete')}
															</a>
														</div>
													</nav>
												</div>
											</section>
											<section className="col-sm-6">
												<label className="input">
													{' '}
													<i className="icon-prepend fa fa-user" />
													<input
														type="text"
														name="PER_CODE"
														id="PER_CODE"
														placeholder={this.props.t('PER_CODE')}
													/>
												</label>
											</section>
											<section className="col-sm-6">
												<label className="input">
													{' '}
													<i className="icon-prepend fa fa-user" />
													<input
														type="text"
														name="PER_NAME"
														id="PER_NAME"
														placeholder={this.props.t('PER_NAME')}
													/>
												</label>
											</section>
											<section className="col-sm-6">
												<label className="select">
													<select name="PER_STATUS">
														<option value="-1" defaultValue disabled>
															{this.props.t('Status')}
														</option>
														<option value="1">{this.props.t('Active')}</option>
														<option value="0">{this.props.t('InActive')}</option>
													</select>{' '}
													<i />{' '}
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
							</div>
						</div>
					</div>
				</div>
				<div id="GroupMembers" className="modal fade" permission="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal">
									&times;
								</button>
								<h4 className="modal-title"> {this.props.t('Users List')}</h4>
							</div>
							<div className="modal_option_bar padd_for_modal_optn">
								<a className="btn btn-primary" onClick={this.getAvailableUsers}>
									<i className="fa fa-users"></i>
									{this.props.t('Assign Users')}
								</a>
							</div>
							<div></div>
							<div className="modal-footer">
								<button type="button" className="btn btn-danger pull-right" data-dismiss="modal">
									<i className="fa fa-close"></i> {this.props.t('Close')}
								</button>
							</div>
						</div>
					</div>
				</div>
				<div id="AssignUsers" className="modal fade" permission="dialog">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								{/*<button type="button" className="close" data-dismiss="modal">&times;</button>*/}
								<button type="button" className="close" onClick={this.closeAssignUserModal}>
									&times;
								</button>
								<h4 className="modal-title">{this.props.t('Users List')}</h4>
							</div>
							<div>
								{this.state.AssignUsers.length > 0 ? (
									<DualListBox
										options={this.state.AssignUsers}
										selected={this.state.GroupsMembersIds}
										onChange={this.handelAssignUsers}
									/>
								) : (
									''
								)}
							</div>
							{/* <div className="modal-footer">
								<button
									type="button btn btn-success"
									className="btn btn-default"
									data-dismiss="modal"
									onClick={this.handelAssignUsers}
								>
									{this.props.t('Submit')}
								</button>
							</div> */}
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default compose(
	withTranslation(),
	connect(state => state.BI, Actions)
)(BIPermissions);

