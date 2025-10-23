import React from 'react';
import $ from 'jquery';
import {config} from '../../../../config/config';
import getAuthonticatedJSON from '../../../../common/utils/functions/getAuthenticatedJSON';
import putRequest from '../../../../common/utils/functions/putRequest';
import {smallBox, BigBreadcrumbs, WidgetGrid, JarvisWidget, SmartMessageBox} from '../../../../common';
import ServerSideDataTable from '../../../../common/tables/components/DataTableServerSide';
import Form from '../../utils/Form';
import jMoment from 'moment-jalaali';
import {connect} from 'react-redux';
import * as Actions from '../../SystemManagementActions';
import {withTranslation} from 'react-i18next';
import {compose} from 'redux';
import MaterialDataTable from "../../../../common/tables/components/MaterialDataTable";
import deleteAuthonticatedJSON from "../../../../common/utils/functions/deleteAuthonticatedJSON";
class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Users: [],
            refresh: false,
            total: null,
            limit: null,
            User: [],
            Edit: false,
            Show: [],
            filter: '',
            UserId: null,
            searchVal: '',
            status: '',
            successor: ''
        };
        this.handelCreate = this.handelCreate.bind(this);
        this.handelShow = this.handelShow.bind(this);
    }

    componentDidMount() {
        let self = this;
        $(document).ready(function () {
            // $(document).on('dblclick', 'td.row-controller.process-designer', OpenLink);
            $(document).on('dblclick', 'td.clicked-item', OpenLink);
            $('#modalClose').on('click', closeModal);

            function OpenLink() {
                let user_uid = $(this)
                    .siblings('td.clicked-item')
                    .find('input')
                    .attr('value');

                self.handelEdit(user_uid);

                self.setState({
                    Edit: true,
                });
            }

            function closeModal() {
                $('#UserBox').modal('hide');
                self.setNullFiels();
                self.setState({Edit: false, refresh: false});
            }
        });
    }

    getUsers = data => {
        this.setState({Users: data});
    };

    handelEdit(userUid) {
        $('#UserBox').modal('show');
        $('#actions').show();
        let self = this;
        this.props.loadUser(config.apiServer + 'user/' + userUid);

        getAuthonticatedJSON(config.apiServer + 'user/' + userUid, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            self.setState({Show: res, status: res.usr_status, successor: res.usr_replaced_by});
            $('#actions').show();
            this.setState({Show: res});
            $('#UserBox').modal('show');
            this.SetData();
        });
    }

    handelDelete(userUid) {
        SmartMessageBox(
            {
                title: this.props.t('Delete confirm title'),
                content: this.props.t('Delete confirm content message'),
                buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']',
            },
            ButtonPressed => {
                if (ButtonPressed === this.props.t('Yes')) {
                    let self = this;
                    deleteAuthonticatedJSON(config.apiServer + 'user/' + userUid).then(res => {
                        if (res === 400) {
                            smallBox({
                                title: this.props.t('Warning'),
                                content:
                                    '<i>' + this.props.t('User can not deleted, user assign to the group') + '</i>',
                                color: '#cb8217',
                                iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                                timeout: 4000,
                            });
                            document.getElementById('new-user-form').reset();
                            self.props.Refresh();
                            setTimeout(() => {
                                self.props.getRefreshStatus();
                            }, 500);
                        } else if (res === 200) {
                            smallBox({
                                title: this.props.t('Successfully'),
                                content: '<i>' + this.props.t('The user have been deleted successfully') + '</i>',
                                color: '#659265',
                                iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                                timeout: 4000,
                            });
                            document.getElementById('new-user-form').reset();
                            let users = self.state.Users.filter(x=>x.USR_UID !== userUid );
                            self.getUsers(users)
                        }
                    })
                        .catch(error=>{
                            if (error.responseJSON.error !== undefined) {
                                var message = error.responseJSON.error.message;
                                if(message.substr(-46) === "cannot be deleted while it has cases assigned."){
                                    message = "User can not be deleted, user has open cases";
                                }
                                smallBox({
                                    title: this.props.t('Warning'),
                                    content:
                                        '<i>' + this.props.t(message) + '</i>',
                                    color: '#cb8217',
                                    iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                                    timeout: 4000,
                                });
                            }
                        });
                }
            }
        );
    }

    handelIndex = () => {
        $('#UserBox').modal('hide');
        const refresh = this.state.refresh ? false : true;
        this.setState({
            refresh: refresh,
        });
    };

    getRefreshStatus = () => {
        this.setState({
            refresh: false,
        });
    };

    handelCreate() {
        this.setNullFiels();
        this.enableFields();
        $('#actions').hide();
        $('#UserBox').modal('show');
    }

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
        $('input[name=usr_due_date]').val('');
    };

    handelShow(data) {
        getAuthonticatedJSON(config.apiServer + 'user/' + data['usr_uid'], {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            $('#actions').show();
            this.setState({Show: res});
            $('#UserBox').modal('show');
            this.SetData();
            this.disableFields();
        });
    }

    SetData() {
        let data = this.props.User;
        $('input[name=usr_uid]').val(data['usr_uid']);
        $('input[name=usr_username]').val(data['usr_username']);
        $('input[name=usr_lastname]').val(data['usr_lastname']);
        $('input[name=usr_firstname]').val(data['usr_firstname']);
        $('input[name=usr_email]').val(data['usr_email']);
        $('input[name=usr_phone]').val(data['usr_phone']);
        $('select[name=usr_role]').val(data['usr_role']);
        $('select[name=usr_status]').val(data['usr_status']);
        $('select[name=usr_replaced_by]').val(data['usr_replaced_by']);
        $('input[name="usr_due_date"]').val(jMoment(data['usr_due_date']).format('jYYYY/jMM/jDD'));
        $('input[name=usr_new_pass]').val(data['usr_new_pass']);
        $('input[name=usr_cnf_pass]').val(data['usr_cnf_pass']);
    }

    disableFields() {
        $('input[name=usr_username]').prop('disabled', true);
        $('input[name=usr_lastname]').prop('disabled', true);
        $('input[name=usr_new_pass]').prop('disabled', true);
        $('input[name=usr_cnf_pass]').prop('disabled', true);
        $('input[name=usr_firstname]').prop('disabled', true);
        $('input[name=usr_email]').prop('disabled', true);
        $('input[name=usr_phone]').prop('disabled', true);
        $('select[name=usr_role]').prop('disabled', true);
        $('select[name=usr_status]').prop('disabled', true);
        $('input[name=usr_due_date]').prop('disabled', true);

        return false;
    }

    enableFields() {
        $('input[name=usr_username]').prop('disabled', false);
        $('input[name=usr_lastname]').prop('disabled', false);
        $('input[name=usr_firstname]').prop('disabled', false);
        $('input[name=usr_email]').prop('disabled', false);
        $('input[name=usr_new_pass]').prop('disabled', false);
        $('input[name=usr_cnf_pass]').prop('disabled', false);
        $('input[name=usr_phone]').prop('disabled', false);
        $('select[name=usr_role]').prop('disabled', false);
        $('select[name=usr_status]').prop('disabled', false);
        $('input[name=usr_due_date]').prop('disabled', false);

        return false;
    }

    onSubmit = evt => {
        evt.preventDefault();
        if (!this.checkPasswordLength()) {
            return;
        }

        if (!this.checkConfirmPassword()) {
            return;
        }
        const data = {
            usr_new_pass: $('#ch_usr_new_pass').val(),
        };
        putRequest(config.apiServer + `users/${this.state.UserId}`, {
            body: JSON.stringify(data),
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
            document.getElementById('change-user-password').reset();
        });
    };

    searchUser = e => {
        this.setState({
            searchVal: e.target.value,
        });
    };

    render() {
        let users = null;
        if (this.state.Users.length > 0) {
            var tmp = [];
            this.state.Users.map(user => {
                tmp.push(this.getTableRow(user,this));
            });
            users = tmp;
        }
        console.log(process.env.REACT_APP_NOT_SECRET_CODE)

        return (<><MaterialDataTable
            title={this.props.t('Users')}
            icon={'fas fa-users'}
            url={config.apiServer + 'users/anr-list'}
            columns={this.getTableRow(users, this)}
            main_filter={true}
            getDataList={data => this.getUsers(data)}
            toolbar_btns={<>
                <button className="btn btn_inbox"
                        onClick={this.handelCreate}
                >
                    <i className="fa fa-plus" />
                    <span>{this.props.t('New user')}</span>
                </button>
            </>}
        />
            <div
                className="modal fade-in-up"
                id="UserBox"
                role="dialog"
                data-keyboard="false"
                data-backdrop="static"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content" id="UserBoxBody">
                        {/*{editUser}*/}
                        {/*<Form Refresh={this.handelIndex}*/}
                        <Form
                            AddUsers={(data)=>{
                                let users = this.state.Users;

                                var key, keys = Object.keys(data);
                                var n = keys.length;
                                var newUser={}
                                while (n--) {
                                    key = keys[n];
                                    newUser[key.toLowerCase()] = data[key];
                                }
                                users.push(newUser);
                                this.getUsers(users)
                            }}
                            removeUser={(uid)=>{
                                let users = this.state.Users.filter(x=>x.USR_UID !== uid );
                                this.getUsers(users)
                            }}

                            Refresh={this.handelIndex}
                            getRefreshStatus={this.getRefreshStatus}
                            Edit={this.state.Edit}
                            Disable={this.disableFields}
                            Enable={this.enableFields}
                            Data={this.props.User}
                            status={this.state.status}
                            successor={this.state.successor}
                        />
                    </div>
                </div>
            </div>
            <div
                className="modal fade-in-up"
                id="changePassword"
                role="dialog"
                data-keyboard="false"
                data-backdrop="static"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form
                            id="change-user-password"
                            className="smart-form"
                            noValidate="novalidate"
                            onSubmit={this.onSubmit}
                        >
                            <div className="modal-header">
                                {/*<button type="button" className="close" data-dismiss="modal">&times;</button>*/}
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-hidden="true"
                                    id="modalClose"
                                >
                                    &times;
                                </button>
                                <h4 className="modal-title">{this.props.t('Change Password')}</h4>
                            </div>
                            <div>
                                <fieldset>
                                    <div className="row">
                                        <section className="col col-6">
                                            <label>
                                                {this.props.t('Password')}
                                                <strong style={{color: 'red'}}>*</strong>
                                            </label>
                                            <label className="input">
                                                <i className="icon-prepend fa fa-lock"/>
                                                <input
                                                    type="password"
                                                    name="usr_new_pass"
                                                    id="ch_usr_new_pass"
                                                    placeholder={this.props.t('Password')}
                                                />
                                            </label>
                                            <div
                                                className="help-block text-danger"
                                                style={{color: '#d44950'}}
                                                id="passwordValidationChangeMsg"
                                            ></div>
                                        </section>
                                        <section className="col col-6">
                                            <label>
                                                {this.props.t('Password Confirmation')}
                                                <strong style={{color: 'red'}}>*</strong>
                                            </label>
                                            <label className="input">
                                                <i className="icon-prepend fa fa-lock"/>
                                                <input
                                                    type="password"
                                                    name="usr_cnf_pass"
                                                    id="ch_usr_cnf_pass"
                                                    placeholder={this.props.t('Password Confirmation')}
                                                />
                                            </label>
                                            <div
                                                className="help-block text-danger"
                                                style={{color: '#d44950'}}
                                                id="confirmPasswordChangeValidationMsg"
                                            ></div>
                                        </section>
                                    </div>
                                </fieldset>
                            </div>
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
        </>);

    }

    getTableRow = (item, self) => {
        return [
            {
                dataField: 'usr_username',
                text: self.props.t('User Name'),
            },
            {
                dataField: 'usr_name',
                text: self.props.t('Last Name'),
                formatter: function (cell, row) {
                    return (<>
                        {row.usr_firstname} {row.usr_lastname}
                    </>)
                }
            },
            {
                dataField: 'usr_status',
                text: self.props.t('Status'),
                formatter: function (cell, item) {
                    return (<>
                        <span className="label label-success">{self.props.t(item.usr_status.toUpperCase())}</span>

                    </>)
                }
            },
            {
                dataField: 'usr_replaced_by',
                text: self.props.t('Supervisor'),
                formatter: function (cell, item) {
                    if (item.usr_replaced_by === "")
                        return self.props.t('Not selected');
                    return item.usr_replaced_by
                }
            },
            {
                dataField: 'role',
                text: self.props.t('Role'),
                formatter: function (cell, item) {
                    let role = '';
                    if (item.usr_role === 'PROCESSMAKER_ADMIN') role = self.props.t('Admin');
                    else if (item.usr_role === 'PROCESSMAKER_OPERATOR') role = self.props.t('Operator');
                    else if (item.usr_role === 'PROCESSMAKER_MANAGER') role = self.props.t('Manager');
                    else if (item.usr_role === 'PROCESSMAKER_DEPADMIN') role = self.props.t('DepAdmin');
                    return (<>
                        {role}
                    </>)
                }
            },
            {
                dataField: 'departmentname',
                text: self.props.t('Department'),
            },
            {
                dataField: 'last_login',
                text: self.props.t('Last Login'),
                formatter: function (cell, item) {
                    let date = jMoment(item.usr_update_date).format('jYYYY/jMM/jDD');
                    let time = jMoment(item.usr_update_date).format('HH:mm:ss');

                    return (<>
                        {time + ' ' + date}
                    </>)
                }
            },
            {
                dataField: 'actions',
                text: self.props.t('actions'),
                formatter: function (cell, item) {
                    return (<div className={'table-actions'}>
                            <i className={'fas fa-edit'}
                                onClick={()=>{
                                    self.handelEdit(item.usr_uid);
                                    self.setState({
                                        Edit: true,
                                    });
                                }}
                            />
                            <i className={'fas fa-key'}
                               onClick={() => self.editUser(item.usr_uid)}
                            />
                            <i className={'fas fa-trash'}
                               onClick={() => self.handelDelete(item.usr_uid)}
                            />
                    </div>)
                }
            },
        ]
    };

    editUser = userUID => {
        $('#changePassword').modal('show');
        this.setState({UserId: userUID});
        //this.checkConfirmPassword();
    };

    checkConfirmPassword = () => {
        // $(passwordValidationMsg)
        const password = $('#ch_usr_new_pass').val();
        const confirmPassword = $('#ch_usr_cnf_pass').val();
        if (password == confirmPassword) {
            return true;
        } else {
            $('#confirmPasswordChangeValidationMsg').text(this.props.t('Confirm Password'));
            setTimeout(() => {
                $('#confirmPasswordChangeValidationMsg').text('');
            }, 20000);
            return false;
        }
    };

    checkPasswordLength = () => {
        // $(passwordValidationMsg)
        // let password = $('#ch_usr_new_pass').val();
        let password = $('#ch_usr_new_pass').val();

        if (password.length >= 6) {
            // console.log('ch : length tr :: ', password);
            return true;
        } else {
            // console.log('ch : length fa :: ', password);
            $('#passwordValidationChangeMsg').text(this.props.t('Minlength Password'));
            setTimeout(() => {
                $('#passwordValidationChangeMsg').text('');
            }, 20000);
            return false;
        }
    };

    filterUsers = e => {
        // this.get
        let filter = $('#searchBox').val();
        this.setState({filter: filter, refresh: true});
    };
}

export default compose(
    withTranslation(),
    connect(state => state.systemManagement, Actions)
)(Users);
