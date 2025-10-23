import React from 'react';
// import Form from '../components/PermissionForm';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';
import {withTranslation} from 'react-i18next';
import $ from 'jquery';
import * as Actions from '../BIActions';
import {connect} from 'react-redux';
import {config} from '../../../config/config';
import {SmartMessageBox, smallBox, getJSON} from '../../../common';
import putRequest from '../../../common/utils/functions/putRequest';
import postRequest from '../../../common/utils/functions/postRequest';
import {compose} from 'redux';
import MaterialDataTable from "../../../common/tables/components/MaterialDataTable";
import moment from 'jalali-moment'
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import deleteAuthonticatedJSON from "../../../common/utils/functions/deleteAuthonticatedJSON";

class BIRoles extends React.Component {
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
            PermissionGroupsMembersIds: [],
            PermissionGroupsMembersIdsConst: [],
            GroupsMembersIdsConst: [],
            AssignUsers: [],
            AbaibleUsersIds: [],
            selectedForAssign: [],
            getUsesr: false,
            rolID: '',
            AssignedUsers: [],
            AssignPermissions: [],
            AbaiblePermissionsIds: [],
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
        this.props.fetchAllRoles(config.apiServer + 'biarian/bi-role');
        var self = this;
        this.handelIndex();
        $('#GroupBox').on('hidden.bs.modal', function () {
            self.handelIndex();
            document.getElementById('new-role-form').reset();
        });
        $('#AssignUser').change(function () {
            alert();
        });
        $(document).ready(function () {
            $(document).delegate('.deleteRow', 'click', function () {
                SmartMessageBox(
                    {
                        title: this.props.t('Delete confirm title'),
                        content: this.props.t('Delete confirm content message'),
                        buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']',
                    },
                    ButtonPressed => {
                        if (ButtonPressed === this.props.t('Yes')) {
                            const id = $(this).attr('rowId');
                            deleteAuthonticatedJSON(config.apiServer + 'biarian/bi-role/' + id).then(res => {
                                smallBox({
                                    title: this.props.t('Successfully'),
                                    content:
                                        '<i>' + this.props.t('Data has been saved successfully') + '</i>',
                                    color: '#659265',
                                    iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                                    timeout: 4000,
                                });
                                $('#GroupBox').modal('hide');

                                // self.props.clearRoles()
                                self.props.fetchAllRoles(config.apiServer + 'biarian/bi-role');
                            });
                        }
                    }
                );
            });

            $(document).delegate('.updateRow', 'click', function () {
                const id = $(this).attr('rowId');
                self.setState({
                    rolID: id,
                });

                $('#updateModal').modal('show');
                $('#ROL_UID').val(id);
                self.props.fetchRole(config.apiServer + 'biarian/bi-role/' + $(this).attr('rowId'));
            });
            $(document).delegate('.role-user', 'click', function () {
                const id = $(this).attr('rowId');
                $('#ROL_UID').val(id);
                $('#userDualBox').modal('show');
                self.getAvailableUsers();
                self.getSelectedUsers(id);
            });
            $(document).delegate('.role-permission', 'click', function () {
                const id = $(this).attr('rowId');
                $('#ROL_UID').val(id);
                $('#permissionDualBox').modal('show');
                self.getAvailablePermission();
                self.getSelectedPermission(id);
            });
        });
    }

    getSelectedPermission = id => {
        getJSON(config.apiServer + 'biarian/bi-role-permission/' + id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            let a = [];
            res.map(d => {
                a.push(d.PER_UID);
                return d;
            });
            this.setState({
                PermissionGroupsMembersIds: a,
            });
        });
    };

    getSelectedUsers = id => {
        getJSON(config.apiServer + 'biarian/bi-role-user/' + id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            let a = [];
            res.map(d => {
                a.push(d.USR_UID);
                return d;
            });
            this.setState({
                GroupsMembersIds: a,
            });
        });
    };

    onUpdate = evt => {
        evt.preventDefault();
        let self = this;
        let url = config.apiServer + 'biarian/bi-role';
        const formData = Array.from(evt.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({...a, [b.name]: b.value}), {});
        // self.props.clearRoles()
        self.props.fetchAllRoles(config.apiServer + 'biarian/bi-role');

        putRequest(url + '/' + formData['ROL_UID'], {
            body: JSON.stringify(formData),
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
            document.getElementById('new-user-form').reset();
            $('#updateModal').modal('hide');
            self.props.Refresh();
        });
    };

    onSubmit = evt => {
        evt.preventDefault();
        let self = this;
        let url = config.apiServer + 'biarian/bi-role';
        const formData = Array.from(evt.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({...a, [b.name]: b.value}), {});
        // self.props.clearRoles()
        self.props.fetchAllRoles(config.apiServer + 'biarian/bi-role');
        postRequest(url, {
            body: JSON.stringify(formData),
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
            document.getElementById('new-user-form').reset();
            self.props.Refresh();
        });
        $('#createModal').modal('hide');
    };

    handelIndex() {
        this.setState({Edit: false});
    }

    handelCreate() {
        $('input[name=ROL_UID]').val('');
        $('input[name=grp_title]').val('');
        $('select[name=grp_status]').val('');
        $('#actions').hide();
        $('#createModal').modal('show');
        this.enableFields();
    }

    handelAssignPermissions = selected => {
        getJSON(config.apiServer + 'biarian/bi-role-permission/' + $('ROL_UID').val(), {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
        });

        let forAssign = selected.filter(data => {
            return this.state.PermissionGroupsMembersIdsConst.indexOf(data) < 0;
        });
        let forUnAssign = this.state.PermissionGroupsMembersIdsConst.filter(data => {
            return selected.indexOf(data) < 0;
        });
        this.setState({PermissionGroupsMembersIds: selected});
        if (forAssign.length > 0) this.assignPermission(forAssign);

        if (forUnAssign.length > 0) this.unAssignPermission(forUnAssign);
    };

    handelAssignUsers(selected) {
        getJSON(config.apiServer + 'biarian/bi-role-user/' + $('ROL_UID').val(), {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
        });

        let forAssign = selected.filter(data => {
            return this.state.GroupsMembersIdsConst.indexOf(data) < 0;
        });
        let forUnAssign = this.state.GroupsMembersIdsConst.filter(data => {
            return selected.indexOf(data) < 0;
        });
        this.setState({GroupsMembersIds: selected});
        if (forAssign.length > 0) this.assignUser(forAssign);

        if (forUnAssign.length > 0) this.unAssignUser(forUnAssign);
    }

    handelShow(data) {
        getJSON(config.apiServer + 'biarian/bi-role/' + data['ROL_UID'], {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            $('#actions').show();
            this.setState({Show: res});
            $('#GroupBox').modal('show');
            this.SetData();
            this.disableFields();
        });
    }

    SetData() {
        let data = this.state.Show;
        $('input[name=ROL_UID]').val(data['ROL_UID']);
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

    assignPermission(permissions) {
        let roleID = $('#ROL_UID').val();
        postRequest(config.apiServer + 'biarian/bi-role-permission', {
            body: JSON.stringify({
                ROL_UID: roleID,
                permissions: permissions,
            }),
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

    unAssignPermission(unassigned) {
        let roleID = $('#ROL_UID').val();
        try {
            for (let i = 0; i < unassigned.length; i++) {
                let usr_uid = unassigned[i];
                deleteAuthonticatedJSON(config.apiServer + 'group/' + roleID + '/user/' + usr_uid).then(res => {
                });
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

    assignUser(users) {
        let roleID = $('#ROL_UID').val();
        postRequest(config.apiServer + 'biarian/bi-role-user', {
            body: JSON.stringify({
                ROL_UID: roleID,
                users: users,
            }),
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
        let roleID = $('#ROL_UID').val();
        try {
            for (let i = 0; i < unassigned.length; i++) {
                let usr_uid = unassigned[i];
                deleteAuthonticatedJSON(config.apiServer + 'group/' + roleID + '/user/' + usr_uid).then(res => {
                });
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
            return d;
        });
        this.setState({GroupsMembersIds: a});
        this.setState({GroupsMembersIdsConst: a});
        this.setState({GroupsMembers: data});

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
                if (ButtonPressed === this.props.t('Yes')) {
                    let roleID = $('#ROL_UID').val();
                    deleteAuthonticatedJSON(config.apiServer + 'biarian/bi-role/' + roleID).then(res => {
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

    getAvailablePermission = () => {
        // let roleID = $('#ROL_UID').val();
        let self = this;
        getJSON(config.apiServer + 'biarian/bi-permission', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            let AssignPermissions = [];
            // let AllUsers = [];
            let AssignPermissionsids = [];
            res.map(item => {
                AssignPermissions.push({
                    value: item.PER_UID,
                    label: '(' + item.PER_CODE + ')' + ' ' + item.PER_NAME,
                });
                AssignPermissionsids.push(item.USR_UID);
            });
            self.state.GroupsMembers.map(item => {
                AssignPermissions.push({
                    value: item.PER_UID,
                    label: '(' + item.PER_CODE + ') ' + item.PER_NAME,
                });
            });
            self.setState({AssignPermissions: AssignPermissions});
            self.setState({AbaiblePermissionsIds: AssignPermissionsids});
            $('#AssignUsers').modal('show');
        });
    };

    getAvailableUsers = () => {
        let roleID = $('#ROL_UID').val();
        let self = this;
        getJSON(config.apiServer + 'users/anr-list', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            let AssignUsers = [];
            let AllUsers = [];
            let AssignUsersids = [];
            res.data.map(item => {
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
            self.setState({AssignUsers: AssignUsers});
            self.setState({AbaibleUsersIds: AssignUsersids});
            $('#AssignUsers').modal('show');
        });
    };

    closeAssignUserModal = () => {
        $('#AssignUsers').modal('hide');
        let status = !this.state.getUsesr;
        this.setState({getUsesr: status});
    };

    render() {
        let data = null;
        if (this.props.Roles.length > 0) {
            data = this.props.Roles;
        }  let self = this;
        return (<>
            <Card id="content">
                <CardContent>
                    <h5 className={'table-header-title'}>
                        <i className={"fal fa-table table-header-icon"}></i>
                        مدیریت BI - نقش ها
                        <button className="btn btn_inbox" onClick={() => this.handelCreate()}>
                            <i className="fa fa-plus"></i>
                            <span>{this.props.t('New Role')}</span>
                        </button>
                    </h5>
                    <MaterialDataTable
                        items={this.props.Roles}
                        columns={[
                            {
                                dataField: 'ROL_UID',
                                text: this.props.t('ROL_UID'),
                                filterable: 'ROL_UID'
                            },
                            {
                                dataField: 'ROL_CODE',
                                text: this.props.t('ROL_CODE'),
                                filterable: 'ROL_CODE'
                            },
                            {
                                dataField: 'ROL_STATUS',
                                text: this.props.t('ROL_STATUS'),
                                filterable: 'ROL_STATUS',
                                filterOptions: [{
                                    key: '1',
                                    text: 'فعال'
                                }, {
                                    key: '0',
                                    text: 'غیر فعال'
                                }
                                ],
                                formatter: function (cell, item) {
                                    return item.ROL_STATUS === '1' ? <span className='label label-success'>فعال</span> :
                                        <span className='label label-danger'>غیر فعال</span>
                                }
                            },
                            {
                                dataField: 'ROL_CREATE_DATE',
                                filterable: 'ROL_CREATE_DATE',
                                text: this.props.t('ROL_CREATE_DATE'),
                                formatter: function (cell, item) {
                                    return moment(item.ROL_CREATE_DATE).format('jYYYY/jMM/jDD HH:mm:ss');
                                }
                            },
                            {
                                dataField: 'ROL_UPDATE_DATE',
                                filterable: 'ROL_UPDATE_DATE',
                                text: this.props.t('ROL_UPDATE_DATE'),
                                formatter: function (cell, item) {
                                    return moment(item.ROL_UPDATE_DATE).format('jYYYY/jMM/jDD HH:mm:ss');
                                }
                            },
                            {
                                dataField: 'actions',
                                text: 'عملیات',
                                formatter: function (cell, item) {
                                    return (<div className={'table-actions'}>
                                        <i className={'fas fa-users'}
                                           onClick={() => {
                                               const id = item.ROL_UID;
                                               $('#ROL_UID').val(id);
                                               $('#userDualBox').modal('show');
                                               self.getAvailableUsers();
                                               self.getSelectedUsers(id);
                                           }}
                                        ></i>
                                        <i className={'fas fa-edit'}
                                           onClick={() => {
                                               const id = item.ROL_UID;
                                               self.setState({
                                                   rolID: id,
                                               });

                                               $('#updateModal').modal('show');
                                               $('#ROL_UID').val(id);
                                               self.props.fetchRole(config.apiServer + 'biarian/bi-role/' + $(this).attr('rowId'));
                                           }}
                                        ></i>
                                        <i className={'fas fa-key'}
                                           onClick={() => {
                                               const id = item.ROL_UID;
                                               $('#ROL_UID').val(id);
                                               $('#permissionDualBox').modal('show');
                                               self.getAvailablePermission();
                                               self.getSelectedPermission(id);
                                           }}
                                        ></i>
                                        <i className={'fas fa-trash'}
                                           onClick={() => {
                                               SmartMessageBox(
                                                   {
                                                       title: self.props.t('Delete confirm title'),
                                                       content: self.props.t('Delete confirm content message'),
                                                       buttons: '[' + self.props.t('No') + '][' + self.props.t('Yes') + ']',
                                                   },
                                                   ButtonPressed => {
                                                       if (ButtonPressed == self.props.t('Yes')) {
                                                           const id = item.ROL_UID;
                                                           deleteAuthonticatedJSON(config.apiServer + 'biarian/bi-role/' + id).then(res => {
                                                               smallBox({
                                                                   title: self.props.t('Successfully'),
                                                                   content:
                                                                       '<i>' + self.props.t('Data has been saved successfully') + '</i>',
                                                                   color: '#659265',
                                                                   iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                                                                   timeout: 4000,
                                                               });
                                                               $('#GroupBox').modal('hide');

                                                               // self.props.clearRoles()
                                                               self.props.fetchAllRoles(config.apiServer + 'biarian/bi-role');
                                                           });
                                                       }
                                                   }
                                               );
                                           }}
                                        ></i>
                                    </div>)
                                }
                            },
                        ]}
                    />

                </CardContent>
            </Card>
            <div id="userDualBox" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
                            </button>
                            <h4 className="modal-title"> {this.props.t('Assign Users')}</h4>
                        </div>
                        <div className="modal-body">
                            <div>
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
                                    selected={this.state.GroupsMembersIds}
                                    onChange={this.handelAssignUsers}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer"></div>
            <div id="permissionDualBox" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
                            </button>
                            <h4 className="modal-title"> {this.props.t('Assign Permission')}</h4>
                        </div>
                        <div className="modal-body">
                            <DualListBox
                                canFilter
                                filterCallback={(option, filterInput) => {
                                    if (filterInput === '') {
                                        return true;
                                    }

                                    return new RegExp(filterInput, 'i').test(option.label);
                                }}
                                filterPlaceholder={this.props.t('Search')}
                                options={this.state.AssignPermissions}
                                selected={this.state.PermissionGroupsMembersIds}
                                onChange={this.handelAssignPermissions}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer"></div>
            {/*End of DuaolBox*/}
            {/* Start of Update Modal*/}
            <div id="updateModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
                            </button>
                            <h4 className="modal-title"> {this.props.t('Edit Role')}</h4>
                        </div>
                        <div className="modal-body">
                            <form
                                id="new-user-form"
                                className="smart-form"
                                noValidate="novalidate"
                                onSubmit={this.onUpdate}
                            >
                                <fieldset>
                                    <input type="hidden" name="ROL_UID" id="ROL_UID"/>
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
                                                            <span className="fa fa-edit"/>{' '}
                                                            {this.props.t('Edit')}
                                                        </a>
                                                    </div>
                                                    <div className="modal_option_item">
                                                        <a onClick={this.handelDelete} className="btn btn-danger">
                                                            <span className="fa fa-remove"/>
                                                            {this.props.t('Delete')}
                                                        </a>
                                                    </div>
                                                </nav>
                                            </div>
                                        </section>
                                        <section className="col-sm-6">
                                            <label className="input">
                                                {' '}
                                                <i className="icon-prepend fa fa-user"/>
                                                <input
                                                    type="text"
                                                    name="ROL_CODE"
                                                    id="ROL_CODE"
                                                    placeholder={this.props.t('ROL_CODE')}
                                                />
                                            </label>
                                        </section>
                                        <section className="col-sm-6">
                                            <label className="input">
                                                {' '}
                                                <i className="icon-prepend fa fa-user"/>
                                                <input
                                                    type="text"
                                                    name="ROL_NAME"
                                                    id="ROL_NAME"
                                                    placeholder={this.props.t('ROL_NAME')}
                                                />
                                            </label>
                                        </section>
                                        <section className="col-sm-6">
                                            <label className="select">
                                                <select name="ROL_STATUS">
                                                    <option value="-1" defaultValue disabled>
                                                        {this.props.t('Status')}
                                                    </option>
                                                    <option value="1">{this.props.t('Active')}</option>
                                                    <option value="0">{this.props.t('InActive')}</option>
                                                </select>{' '}
                                                <i/>{' '}
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
            <div className="modal-footer"></div>
            {/* End of of Update Modal*/}
            {/* Start of AddNew  Modal*/}
            <div id="createModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
                            </button>
                            <h4 className="modal-title"> {this.props.t('Add New Role')}</h4>
                        </div>
                        <div className="modal-body">
                            <form
                                id="new-user-form"
                                className="smart-form"
                                noValidate="novalidate"
                                onSubmit={this.onSubmit}
                            >
                                <fieldset>
                                    <input type="hidden" name="ROL_UID" id="ROL_UID"/>
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
                                                <i className="icon-prepend fa fa-user"/>
                                                <input
                                                    type="text"
                                                    name="ROL_CODE"
                                                    id="ROL_CODE"
                                                    placeholder={this.props.t('ROL_CODE')}
                                                />
                                            </label>
                                        </section>
                                        <section className="col-sm-6">
                                            <label className="input">
                                                {' '}
                                                <i className="icon-prepend fa fa-user"/>
                                                <input
                                                    type="text"
                                                    name="ROL_NAME"
                                                    id="ROL_NAME"
                                                    placeholder={this.props.t('ROL_NAME')}
                                                />
                                            </label>
                                        </section>
                                        <section className="col-sm-6">
                                            <label className="select">
                                                <select name="ROL_STATUS">
                                                    <option value="-1" defaultValue disabled>
                                                        {this.props.t('Status')}
                                                    </option>
                                                    <option value="1">{this.props.t('Active')}</option>
                                                    <option value="0">{this.props.t('InActive')}</option>
                                                </select>{' '}
                                                <i/>{' '}
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
            </>
        );
    }
}

export default compose(
    withTranslation(),
    connect(state => state.BI, Actions)
)(BIRoles);

