import React from 'react';

import $ from 'jquery';
import getAuthonticatedJSON from '../../../../common/utils/functions/getAuthenticatedJSON';
import { config } from '../../../../config/config';
import putRequest from '../../../../common/utils/functions/putRequest';
import { smallBox, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../common';
import postAuthenticatedJSON from '../../../../common/utils/functions/postAuthenticatedJSON';
import TreeView from '../../../../common/ui/components/TreeView';
import Form from '../../utils/DepartmentForm';
import DualListBox from 'react-dual-listbox';
import { connect } from 'react-redux';
import * as Actions from '../../SystemManagementActions';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import deleteAuthonticatedJSON from "../../../../common/utils/functions/deleteAuthonticatedJSON";
class Department extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Departments: [],
			Department: [],
			Edit: false,
			Show: [],
			refresh: false,
			parent: '',
			AssignUsers: [],
			DepMembers: [],
			DepMembersIds: [],
			DepMembersIdsConst: [],
		};
		this.newHandelCreate = this.newHandelCreate.bind(this);
		this.handelIndex = this.handelIndex.bind(this);
		this.handelCreate = this.handelCreate.bind(this);
		this.handelShow = this.handelShow.bind(this);
		this.getAvailableUsers = this.getAvailableUsers.bind(this);
		this.assignUsers = this.assignUsers.bind(this);
		this.getAssignedUsers = this.getAssignedUsers.bind(this);
		this.assignUsers = this.assignUsers.bind(this);
		this.setDepartmentManager = this.setDepartmentManager.bind(this);
		this._filterTree = this._filterTree.bind(this);
	}

	componentDidMount() {
		let self = this;
		this.handelIndex();
		$('#DepartmentBox').on('hidden.bs.modal', function() {
			self.handelIndex();
			// document.getElementById('new-role-form').reset();
		});
		$(document).on('click', '.addDep', function(evt) {
			self.setState({ parent: evt.target.id });
			self.handelCreate(evt.target.id);
		});
		$(document).on('click', '.editDep', function(evt) {
			self.setState({ parent: evt.target.id });
			self.handelShow(evt.target.id);
		});
		$(document).on('click', '.deleteDep', function(evt) {
			self.setState({ parent: evt.target.id });
			self.handelShow(evt.target.id);
		});
		$(document).on('click', '.assignUser', function(evt) {
			self.setState({ parent: evt.target.id ? evt.target.id : '' });
			self.setState({ DepMembersIdsConst: self.state.DepMembersIds });
			self.getAssignedUsers();
			self.handleAssignUsers(evt.target.id);
		});
	}

	handelIndex() {
		getAuthonticatedJSON(config.apiServer + 'departments', {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token'),
				'Content-Type': 'application/json',
			},
		}).then(res => {
			res.map(r => {
				this.buildTree(r);
			});
			this.setState({ Departments: res });
			this.setState({ Department: res });
		});
		this.setState({ Edit: false });
	}

	handelCreate(parent_id) {
		this.enableFields();
		$('input[name=dep_parent]').val(parent_id);
		$('#actions').hide();
		$('#DepartmentBox').modal('show');
	}
	newHandelCreate() {
		this.enableFields();
		$('input[name=dep_parent]').val('');
		$('#actions').hide();
		$('#DepartmentBox').modal('show');
	}

	buildTree(data) {
		if (data !== null) data.children = data.dep_children;
		data.expanded = false;
		data.content = `<span class="node" id="${data.dep_uid}"><i class="fa fa-lg ${
			data.children.length === 0 ? `fa-angle-double-left` : `fa-folder-open`
		}"></i> + ${data.dep_title} (کاربران : ${data.dep_members})
                        <a class="addDep departman_nodebtn" ><i class="fa fa-plus" id="${data.dep_uid}"></i> </a>
                        <a class="editDep departman_nodebtn"><i class="fa fa-edit" id="${data.dep_uid}"></i></a>
                        <a class="assignUser departman_nodebtn"><i class="fa fa-users" id="${data.dep_uid}"></i></a>
                       ${
							data.dep_children.length > 0 || data.dep_members > 0
								? ''
								: `<a class="deleteDep departman_nodebtn"><i class="fa fa-remove" id="${data.dep_uid}"></i></a>`
						}
</span>`;
		data.children.map(r => {
			this.buildTree(r);
		});
	}

	handelShow(id) {
		this.props.loadDepartment(config.apiServer + 'department/' + id);
		getAuthonticatedJSON(config.apiServer + 'department/' + id, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token'),
				'Content-Type': 'application/json',
			},
		}).then(res => {
			$('#actions').show();
			this.setState({ Show: res });
			$('#DepartmentBox').modal('show');
			this.SetData();
			this.disableFields();
		});
	}

	handleAssignUsers() {
		$('#AssignDepartmentUsers').modal('show');
	}

	assignUsers(selected) {
		let DepMembersIdsCon = this.state.DepMembersIds;
		let forAssign = selected.filter(data => {
			return DepMembersIdsCon.indexOf(data) < 0;
		});
		let forUnAssign = DepMembersIdsCon.filter(data => {
			return selected.indexOf(data) < 0;
		});
		this.setState({ DepMembersIds: selected });
		if (forAssign.length > 0) this.assignUser(forAssign);

		if (forUnAssign.length > 0) this.unAssignUser(forUnAssign);
	}

	setDepartmentManager() {
		let user = $('#manager').val();
		putRequest(config.apiServer + `department/${this.state.parent}/set-manager/${user}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token'),
				'Content-Type': 'application/json',
			},
		}).then(res => {
			if (res.statusCode == 200) {
				smallBox({
					title: this.props.t('Successfully'),
					content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
					color: '#659265',
					iconSmall: 'fa fa-check fa-2x fadeInRight animated',
					timeout: 4000,
				});
				this.getAssignedUsers();
			}
		});
	}

	unSetDepartmentManager = () => {
		let user = $('#manager').val();
		var data = {
			USR_UID: user,
			DEP_UID: this.state.parent,
			NO_DEP_MANAGER: 0,
		};
		// postRequest(config.apiServer + `department/${this.state.parent}/set-manager/${user}`,
		postAuthenticatedJSON(config.apiServer + `departmentapi/unSetManager`, {
			body: JSON.stringify(data),
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token'),
				'Content-Type': 'application/json',
			},
		}).then(res => {
			if (res.success) {
				smallBox({
					title: this.props.t('Successfully'),
					content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
					color: '#659265',
					iconSmall: 'fa fa-check fa-2x fadeInRight animated',
					timeout: 4000,
				});
				this.getAssignedUsers();
			}
		});
	};

	assignUser(users) {
		users.map(user => {
			postAuthenticatedJSON(config.apiServer + `department/${this.state.parent}/assign-user`, {
				body: JSON.stringify({ usr_uid: user }),
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access_token'),
					'Content-Type': 'application/json',
				},
			}).then(res => {});
		});
		smallBox({
			title: this.props.t('Successfully'),
			content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
			color: '#659265',
			iconSmall: 'fa fa-check fa-2x fadeInRight animated',
			timeout: 4000,
		});
	}

	unAssignUser(unassigned) {
		try {
			unassigned.map(user => {
				deleteAuthonticatedJSON(config.apiServer + `department/${this.state.parent}/unassign-user/${user}`).then(res => {});
			});
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

	getAvailableUsers() {
		let self = this;
		getAuthonticatedJSON(config.apiServer + `department/${this.state.parent}/available-user`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access_token'),
				'Content-Type': 'application/json',
			},
		}).then(res => {
			let AssignUsers = [];
			let AssignUsersids = [];
			res.map(item => {
				AssignUsers.push({
					value: item.usr_uid,
					label: item.usr_firstname + ' ' + item.usr_lastname + ' ( ' + item.usr_username + ' )',
				});
				AssignUsersids.push(item.usr_uid);
			});
			if (self.state.DepMembers.length > 0)
				self.state.DepMembers.map(item => {
					AssignUsers.push(item);
				});

			self.setState({ AssignUsers: AssignUsers });
		});
	}

	getAssignedUsers() {
		let self = this;
		if (this.state.parent)
			getAuthonticatedJSON(config.apiServer + `department/${this.state.parent}/assigned-user`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access_token'),
					'Content-Type': 'application/json',
				},
			}).then(res => {
				let AssignedUsers = [];
				let AssignedUsersids = [];
				if (res.length == 0) {
					self.setState({ DepMembers: [] });
					self.getAvailableUsers();
				} else
					res.map(item => {
						AssignedUsers.push({
							value: item.usr_uid,
							label:
								item.usr_firstname +
								' ' +
								item.usr_lastname +
								(item.usr_supervisor ? ' * ' : ' ') +
								' ( ' +
								item.usr_username +
								' )',
							supervisor: item.usr_supervisor,
						});
						AssignedUsersids.push(item.usr_uid);
						self.setState({ DepMembers: AssignedUsers });
						self.setState({ DepMembersIds: AssignedUsersids });
						self.getAvailableUsers();
					});
			});
	}

	SetData() {
		let data = this.state.Show;
		$('input[name=dep_uid]').val(data['dep_uid']);
		$('input[name=dep_title]').val(data['dep_title']);
		$('input[name=dep_parent]').val(data['dep_parent']);
		$('select[name=dep_status]').val(data['dep_status']);
	}

	disableFields() {
		$('input[name=dep_title]').prop('disabled', true);
		$('input[name=dep_parent]').prop('disabled', true);
		$('select[name=dep_status]').prop('disabled', true);

		return false;
	}

	enableFields() {
		$('input[name=dep_title]').prop('disabled', false);
		$('input[name=dep_parent]').prop('disabled', false);
		$('select[name=dep_status]').prop('disabled', false);
		return false;
	}

	_filterTree(evt) {
		let cases = this.state.Department;
		if (evt.target.value != '') {
			let filtered = cases.filter(x => {
				return x.children.some(function(y) {
					if (y.children.length > 0) {
						return y.children.some(() => {
							return y.dep_title.includes(evt.target.value);
						});
					}
					return y.dep_title.includes(evt.target.value);
					// return y.name.includes(evt.target.value);
				});
			});
			this.setState({ Departments: filtered });
		} else this.setState({ Departments: cases });
	}

	render() {
		return (<>
			<Card id="content">
				<CardContent>
					<h5 className={'table-header-title'}>
						<i className={"fal fa-sitemap table-header-icon"}></i>
						{this.props.t('Departments List')}
						<button className="btn btn_inbox" onClick={()=>this.handelCreate()}>
							<i className="fa fa-plus"></i>
							<span>مورد جدید</span>
						</button>
					</h5>

					<div id="myTabContent1" className="tab-content">
						<TreeView items={this.state.Departments} role="tree" />
					</div>
				</CardContent>
			</Card>

			<div className="modal fade-in-up" id="DepartmentBox" role="dialog">
				<div className="modal-dialog modal-full">
					<div className="modal-content" id="DepartmentBoxBody">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								×
							</button>
							<h4 className="modal-title">تنظیمات دپارتمان</h4>
						</div>
						<Form
							Parent={this.state.parent}
							Refresh={this.handelIndex}
							Edit={this.state.Edit}
							Disable={this.disableFields}
							Enable={this.enableFields}
							Data={this.state.Show}
							Departments={this.state.Departments}
						/>
					</div>
				</div>
			</div>

			<div className="modal fade-in-up" id="AssignDepartmentUsers" role="dialog">
				<div className="modal-dialog modal-full">
					<div className="modal-content" id="AssignDepartmentUsersBody">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								×
							</button>
							<h4 className="modal-title">{this.props.t('Assign Users to Department')}</h4>
						</div>
						<div className="modal-body">
							{this.state.AssignUsers.length > 0 ? (
								<div className="row">
									<DualListBox
										canFilter
										filterCallback={(option, filterInput) => {
											if (filterInput === '') {
												return true;
											}

											return new RegExp(filterInput, 'i').test(option.label);
										}}
										filterPlaceholder={this.props.t('Search')}
										options={this.state.AssignUsers}
										selected={this.state.DepMembersIds}
										onChange={this.assignUsers}
									/>
									<div className="col-md-6">
										<select name="manager" id="manager" className="form-control">
											{this.state.DepMembers.map(x => {
												return (
													<option
														selected={x.supervisor ? `selected` : false}
														value={x.value}
													>
														{x.label}
													</option>
												);
											})}
										</select>
									</div>
									<div className="col-md-3">
										<button
											id="set"
											onClick={this.setDepartmentManager}
											className="btn btn-block btn-success"
										>
											{this.props.t('Set Manager')}
										</button>
									</div>
									<div className="col-md-3">
										<button
											id="unser"
											onClick={this.unSetDepartmentManager}
											className="btn btn-block btn-success"
										>
											{this.props.t('No Set Manager')}
										</button>
									</div>
								</div>
							) : (
								<div className="alert alert-danger">
									<p>کاربری برای انتصاب وجود ندارد</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>)
	}
}
export default compose(
	withTranslation(),
	connect(state => state.systemManagement, Actions)
)(Department);
