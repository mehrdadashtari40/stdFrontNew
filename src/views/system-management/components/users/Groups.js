import React from 'react';
import $ from 'jquery';
import getAuthonticatedJSON from '../../../../common/utils/functions/getAuthenticatedJSON';
import {config} from '../../../../config/config';
import {smallBox, SmartMessageBox} from '../../../../common';
import Form from '../../utils/GroupForm';
import DualListBox from 'react-dual-listbox';
import {connect} from 'react-redux';
import * as Actions from '../../SystemManagementActions';
import {withTranslation} from 'react-i18next';
import {compose} from 'redux';
import MaterialDataTable from "../../../../common/tables/components/MaterialDataTable";
import postAuthenticatedJSON from "../../../../common/utils/functions/postAuthenticatedJSON";
import deleteAuthonticatedJSON from "../../../../common/utils/functions/deleteAuthonticatedJSON";

class Groups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            current_group_uid:null
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
        let self = this;
        this.handelIndex();
        $('#GroupBox').on('hidden.bs.modal', function () {
            self.handelIndex();
            // document.getElementById('new-role-form').reset();
        });
        $('#AssignUser').change(function () {
            alert();
        });
    }

    handelIndex() {
        this.props.loadGroups(config.apiServer + 'groups');
        this.setState({Edit: false});
    }

    handelCreate() {
        $('input[name=grp_uid]').val('');
        $('input[name=grp_title]').val('');
        $('select[name=grp_status]').val('');
        $('#actions').hide();
        $('#GroupBox').modal('show');
        this.enableFields();
    }

    handelAssignUsers(selected) {
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
        getAuthonticatedJSON(config.apiServer + 'group/' + data['grp_uid'], {
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
            this.setState({
                current_group_uid: data['grp_uid']
            })
        });
    }

    SetData() {
        let data = this.state.Show;
        $('input[name=grp_uid]').val(data['grp_uid']);
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
        let grpId = $('#grp_uid').val();
        postAuthenticatedJSON(config.apiServer + 'group/batch-users', [
            {
                groupUid: grpId,
                users: users,
            }
        ]).then(res => {
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
        let grpId = $('#grp_uid').val();
        try {
            for (let i = 0; i < unassigned.length; i++) {
                let usr_uid = unassigned[i];
                deleteAuthonticatedJSON(config.apiServer + 'group/' + grpId + '/user/' + usr_uid).then(res => {
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
                    let grpId = $('#grp_uid').val();
                    deleteAuthonticatedJSON(config.apiServer + 'group/' + grpId).then(res => {
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
        let grpId = $('#grp_uid').val();
        let self = this;
        getAuthonticatedJSON(config.apiServer + 'group/' + grpId + '/available-users', {
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
                    label: '(' + item.usr_username + ')' + ' ' + item.usr_firstname + ' ' + item.usr_lastname,
                });
                AssignUsersids.push(item.usr_uid);
                return item;
            });
            self.state.GroupsMembers.map(item => {
                AssignUsers.push({
                    value: item.usr_uid,
                    label: '(' + item.usr_username + ') ' + item.usr_firstname + ' ' + item.usr_lastname,
                });
                return item;
            });
            self.setState({AssignUsers: AssignUsers});
            self.setState({AbaibleUsersIds: AssignUsersids});
            $('#AssignUsers').modal('show');
        });
    }

    closeAssignUserModal = () => {
        $('#AssignUsers').modal('hide');
        let status = !this.state.getUsesr;
        this.setState({getUsesr: status});
    };

    render() {
        let self = this;
        return (<><MaterialDataTable
            title={'گروه'}
            icon={'fas fa-table'}
            items={this.props.Groups}
            columns={[
                {
                    dataField: 'grp_title',
                    text: 'عنوان گروه',
                    filterable: 'grp_title'
                },
                {
                    dataField: 'grp_status',
                    text: 'وضعیت',
                    filterable: 'grp_status',
                    filterOptions: [{
                        key: 'active',
                        text: 'فعال'
                    }, {
                        key: 'inactive',
                        text: 'غیر فعال'
                    }
                    ],
                    formatter: function (cell, item) {
                        return item.grp_status === 'ACTIVE' ? <span className='label label-success'>فعال</span> :
                            <span className='label label-danger'>غیر فعال</span>
                    }
                },
                {
                    dataField: 'grp_users',
                    filterable: 'grp_users',
                    text: 'تعداد کاربران',
                },
                {
                    dataField: 'grp_tasks',
                    filterable: 'grp_tasks',
                    text: 'تعداد وظیفه',
                },
                {
                    dataField: 'actions',
                    text: 'عملیات',
                    formatter: function (cell, item) {
                        return (<div className={'table-actions'}>
                            <i className={'fas fa-edit'}
                               onClick={() => {
                                   self.handelShow(item)
                               }}
                            ></i>
                        </div>)
                    }
                },
            ]}
            getDataList={data => this.getUsers(data)}
            toolbar_btns={<>
                <button className="btn btn_inbox"
                        onClick={this.handelCreate}
                >
                    <i className="fa fa-plus" />
                    <span>گروه جدید</span>
                </button>
            </>}
        />

            <div id="GroupBox" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
                            </button>
                            <h4 className="modal-title"> {this.props.t('Group Details')}</h4>
                        </div>
                        <div className="modal-body">
                            <Form
                                Refresh={this.handelIndex}
                                Edit={this.state.Edit}
                                Disable={this.disableFields}
                                Enable={this.enableFields}
                                Data={this.state.Show}
                                setGroupsMembers={this.setGroupsMembers}
                                getUsers={this.state.getUsesr}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div id="GroupMembers" className="modal fade" role="dialog">
                <div className="modal-dialog modal-lg">
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
                        <div>
                            <MaterialDataTable
                                title={'کاربران'}
                                icon={'fas fa-table'}
                                url={config.apiServer + 'group/'+this.state.current_group_uid+'/users'}
                                fixedCount={5}
                                columns={[
                                    {
                                        dataField: 'usr_username',
                                        text: 'نام کاربری',
                                    },
                                    {
                                        dataField: 'usr_firstname',
                                        text: 'نام و نام خانوادگی',
                                        formatter: function (cell, item) {
                                            return item.usr_firstname + " " + item.usr_lastname
                                        }
                                    },
                                    {
                                        dataField: 'usr_status',
                                        text: 'وضعیت',
                                        formatter: function (cell, item) {
                                            return item.usr_status.toString() === 'ACTIVE' ? <span className='label label-success'>فعال</span> :
                                                <span className='label label-danger'>غیر فعال</span>
                                        }
                                    }
                                ]}
                                getDataList={data => this.getUsers(data)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger pull-right" data-dismiss="modal">
                                <i className="fa fa-close"></i> {this.props.t('Close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="AssignUsers" className="modal fade" role="dialog">
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
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button btn btn-success"
                                className="btn btn-default"
                                data-dismiss="modal"
                                // onClick={this.assignUser}
                            >
                                {this.props.t('Submit')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>);
    }
}

export default compose(withTranslation(), connect(state => state.systemManagement, Actions))(Groups);
