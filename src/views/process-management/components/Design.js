import React from 'react';
import $ from 'jquery';
import getAuthenticatedJSON from '../../../common/utils/functions/getAuthenticatedJSON';
import Week from '../utils/weekDays';
import Every from '../utils/every';
import OneTime from '../utils/oneTimeOnly';
import Date from '../utils/date';
import Month from '../utils/monthly';
import postAuthenticatedJSON from '../../../common/utils/functions/postAuthenticatedJSON';
import {smallBox, SmartMessageBox} from '../../../common';
import DropzoneComponent from 'react-dropzone-component';
import DualListBox from 'react-dual-listbox';
import { connect } from 'react-redux';
import * as Actions from '../ProcessManagementActions';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import postRequest from '../../../common/utils/functions/postRequest';
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import MaterialDataTable from "../../../common/tables/components/MaterialDataTable";
import deleteAuthonticatedJSON from "../../../common/utils/functions/deleteAuthonticatedJSON";
import { Button, Modal } from "react-bootstrap";
import {AppConfig} from "../../../appConfig";
//


class ProcessManagement extends React.Component {
    static contextType = AppConfig;

    constructor(props) {
        super(props);
        this.state = {
            project_file: ' ',
            data: [],
            categories: [],
            name: ' ',
            newCategory: {
                title: ' ',
                description: ' ',
                categoryId: 0,
            },
            btn: [1],
            process_id: ' ',
            available_variables: [],
            assigned_variables: [],
            schedule: ' ',

            sch_uid: ' ',
            tas_uid: ' ',
            sch_name: ' ',
            tasks: [],
            sch_start_time: ' ',
            sch_option: ' ',
            sch_week_days: ' ',
            sch_repeat_every: ' ',
            sch_start_day_opt_1: ' ',
            sch_start_day_opt_2: ' ',
            sch_start_day: '1',
            prj_uid: ' ',
            sch_start_date: ' ',
            sch_end_date: ' ',
            sch_days_perform_task: ' ',
            sch_months: '1|2|3|4|5|6|7|8|9|10|11|12',
            sch_time_next_run: ' ',
            sch_last_state: ' ',
            sch_state: 'ACTIVE',
            sch_last_run_time: ' ',
            sch_every_days: ' ',
            usr_uid: ' ',
            current_open_menu: null,
            modal_open: false,
            modal_title: '',
            modal_description: '',
            modal_action: null,
            modal_action_data: [],
        };
        this.onChange = this.onChange.bind(this);
        this.ShowModal = this.ShowModal.bind(this);
        this.InsertNew = this.InsertNew.bind(this);
        this.GetProcessList = this.GetProcessList.bind(this);
        this.deleteProcess = this.deleteProcess.bind(this);
        this.deactivateProcess = this.deactivateProcess.bind(this);
        this.deleteCases = this.deleteCases.bind(this);
        this.handleAssignVariable = this.handleAssignVariable.bind(this);
        this.assignVariables = this.assignVariables.bind(this);
        this.getAssignedVariables = this.getAssignedVariables.bind(this);
        this.setDefaultVariable = this.setDefaultVariable.bind(this);
        this.handleProcessTask = this.handleProcessTask.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onSChange = this.onSChange.bind(this);
        this.onTaskChange = this.onTaskChange.bind(this);
        this.getTasks = this.getTasks.bind(this);
    }

    componentDidMount() {
        const config = this.context;
        getAuthenticatedJSON(config.apiServer + 'userextend/get-my-uid').then(res => {
            this.setState({
                usr_uid: res,
            });
        });
        this.GetProcessList();

        $(document).ready(function () {
            const config = this.context;
            $(document).on('dblclick', 'td.row-controller.process-designer', OpenLink);

            function OpenLink() {
                const id = $(this)
                    .siblings('.hide.id')
                    .html();
                let win = window.open(
                    config.iframeServer + 'designer?prj_uid=' + id + '&sid=' + localStorage.getItem('session_id'),
                    '_blank'
                );
                if (win) {
                    //Browser has allowed it to be opened
                    win.focus();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups for this website');
                }
            }
        });
    }

    exportProcess = (id = null) => {
        const config = this.context;
        let self = this;
        if (id === null) {
            let SelectorSTR = 'input.case-select[type=checkbox]';
            $(SelectorSTR).each(function () {
                if (this.checked) {
                    let URL = config.apiServer + 'project/' + this.value + '/export';
                    // const Token = sessionStorage.getItem('access_token');
                    getAuthenticatedJSON(URL)
                        .then(xml => {
                            self.downloadFile('file.pmx', xml.responseText);
                        })
                        .catch(err => {
                            self.downloadFile('file.pmx', err.responseText);
                        });
                }
            });
        } else {
            let URL = config.apiServer + 'project/' + id + '/export';
            getAuthenticatedJSON(URL)
                .then(xml => {
                    self.downloadFile('file.pmx', xml.responseText);
                })
                .catch(err => {
                    self.downloadFile('file.pmx', err.responseText);
                });
            self.setState({
                current_open_menu: null
            })
        }

    };

    downloadFile = (filename, text) => {
        var element = document.getElementById('export');
        element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        element.click();
    };

    importProject = () => {
        const config = this.context;
        let URL =
            config.apiServer +
            'project/import?option=' +
            $('select#import_option option')
                .filter(':selected')
                .val();
        let request = {
            project_file: $('#project_file').val(),
        };
        postAuthenticatedJSON(URL, request).then(res => {
            // return;
            // let win = window.open(config.iframeServer +'designer?prj_uid='+res[0].new_uid, '_blank');
            // if (win) {
            //     self.GetProcessList();
            //     this.setState({newCategory:{
            //             title:'',
            //             description:'',
            //             categoryId:0
            //         }});
            //
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     alert('Please allow popups for this website');
            // }
        });
    };

    selectFieldsOfProcess = () => {
        const config = this.context;
        let URL =
            config.apiServer +
            'project/import?option=' +
            $('select#import_option option')
                .filter(':selected')
                .val();
        let request = {
            project_file: $('#project_file').val(),
        };
        postAuthenticatedJSON(URL, request).then(res => {
            // return;
            // let win = window.open(config.iframeServer +'designer?prj_uid='+res[0].new_uid, '_blank');
            // if (win) {
            //     self.GetProcessList();
            //     this.setState({newCategory:{
            //             title:'',
            //             description:'',
            //             categoryId:0
            //         }});
            //
            //     //Browser has allowed it to be opened
            //     win.focus();
            // } else {
            //     //Browser has blocked it
            //     alert('Please allow popups for this website');
            // }
        });
    };

    onStart = e => {
        this.setState({
            sch_start_date: e
        });
    };
    onEnd = e => {
        this.setState({
            sch_end_date: e
        });
    };
    onExecute = e => {
        this.setState({
            sch_start_time: e.target.value,
        });
    };
    onWeekDays = weekDays => {
        this.setState({
            sch_week_days: weekDays,
        });
    };
    onEvery = e => {
        this.setState({
            sch_repeat_every: e.target.value,
        });
    };
    onOption1 = e => {
        this.setState({
            sch_start_day_opt_1: e.target.value,
        });
    };
    onOption2 = result => {
        this.setState({
            sch_start_day_opt_2: result,
        });
    };
    onStartDay = e => {
        this.setState({
            sch_start_day: e.target.value,
        });
    };

    renderSwitch(param) {
        let self = this;
        switch (param) {
            case '1':
                return (
                    <Date
                        onStart={e => this.onStart(e)}
                        onEnd={e => this.onEnd(e)}
                        onExecute={e => this.onExecute(e)}
                    />
                );
            case '2':
                return (
                    <Week
                        onStart={e => this.onStart(e)}
                        onEnd={e => this.onEnd(e)}
                        onExecute={e => this.onExecute(e)}
                        onWeekDays={e => this.onWeekDays(e)}
                    />
                );
            case '3':
                return (
                    <Month
                        onStart={e => this.onStart(e)}
                        onEnd={e => this.onEnd(e)}
                        onExecute={e => this.onExecute(e)}
                        onOption1={e => this.onOption1(e)}
                        onOption2={result => this.onOption2(result)}
                        onStartDay={e => this.onStartDay(e)}
                    />
                );
            case '4':
                return <OneTime onExecute={e => this.onExecute(e)} />;
            case '5':
                return <Every onEvery={e => this.onEvery(e)} />;
            default:
                return self.props.t('no schedule selected');
        }
    }

    onSubmit() {
        const config = this.context;
        postRequest(config.apiServer + 'project/' + this.state.prj_uid + '/' + 'case-scheduler', {
            body: JSON.stringify({
                sch_option: this.state.sch_option,
                sch_name: this.state.sch_name,
                sch_del_user_name: 'admin',
                sch_del_user_uid: '00000000000000000000000000000001',
                sch_del_user_pass: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
                pro_uid: this.state.prj_uid,
                tas_uid: this.state.tas_uid,
                sch_start_time: this.state.sch_start_time,
                sch_start_date: this.state.sch_start_date,
                sch_week_days: this.state.sch_week_days,
                sch_start_day: this.state.sch_start_day,
                sch_start_day_opt_1: this.state.sch_start_day_opt_1,
                sch_start_day_opt_2: this.state.sch_start_day_opt_2,
                sch_end_date: this.state.sch_end_date,
                sch_repeat_every: this.state.sch_repeat_every,
                sch_time_next_run: this.state.sch_time_next_run,
                sch_last_run_time: this.state.sch_last_run_time,
                sch_state: this.state.sch_state,
                sch_last_state: this.state.sch_last_state,
                usr_uid: this.state.usr_uid,
                sch_days_perform_task: this.state.sch_days_perform_task,
                sch_every_days: this.state.sch_every_days,
                sch_months: this.state.sch_months,
            }),
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            $('#selectProcessTaskModal').modal('hide');
        });
    }

    render() {
        const config = this.context;
        let self = this;
        const mainComponent = (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <select className="form-control" onChange={this.onTaskChange}>
                            <option value="">{this.props.t('Select Task')}</option>
                            {this.state.tasks.map(x => {
                                return <option value={x.value}>{x.label}</option>;
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <input placeholder={this.props.t('Name')} className="form-control" type="text" onChange={this.onNameChange} />
                    </div>
                    <div className="form-group">
                        <select className="form-control" onChange={this.onSChange}>
                            <option value="">{this.props.t('choose schedule')}</option>
                            <option value="1">{this.props.t('daily')}</option>
                            <option value="2">{this.props.t('weekly')}</option>
                            <option value="3">{this.props.t('monthly')}</option>
                            <option value="4">{this.props.t('once')}</option>
                            <option value="5">{this.props.t('each')}</option>
                        </select>
                    </div>
                </div>
            </div>
        );

        const column = [
            {
                class: '',
                orderable: false,
                data: null,
                defaultContent: '',
                render: function (data) {
                    return "<input class='case-select' type='checkbox' value='" + data.PRO_UID + "'>";
                },
            },
            {
                class: 'row-controller process-designer',
                data: 'PRO_TITLE',
            },
            {
                class: 'row-controller process-designer',
                data: 'PRO_CATEGORY_LABEL',
                render: function (data) {
                    if (data === '- No Category -') {
                        return '<div>بدون دسته بندی</div>';
                    } else return data;
                },
            },
            {
                class: 'row-controller process-designer',
                data: 'PRO_STATUS',
                render: function (data) {
                    if (data === 'ACTIVE') {
                        return "<div class='label label-success'>فعال</div>";
                    } else {
                        return "<div class='label label-danger'>غیر فعال</div>";
                    }
                },
            },
            {
                class: 'row-controller process-designer',
                data: 'CASES_COUNT',
            },
            {
                class: 'row-controller process-designer',
                data: 'CASES_COUNT_COMPLETED',
            },
            {
                class: 'hide id',
                data: 'PRO_UID',
            },
        ];
        // dom: "<'dt-toolbar'<'col-sm-6 col-xs-12 hidden-xs'f><'col-sm-6 col-xs-12 hidden-xs text-right'l>r>t<'dt-toolbar-footer'<'col-xs-12 col-sm-6'p>>",

        let uploadEventHandlers = {
            success: (t, data) => {
                $('#project_file').val(data.filepath);
                $('#importBtn').prop('disabled', false);
            },
        };

        let assignedVariables = null;
        if (this.state.assigned_variables.length > 0) {
            var items = [];
            this.state.assigned_variables.map(x => {
                this.state.available_variables.map(variable => {
                    if (variable.value == x) items.push(variable);
                });
            });

            assignedVariables = (<select name="default_variable" id="default_variable" className="form-control">
                {items.map(x => {
                    return <option value={x.value}>{x.label}</option>;
                })}
            </select>);
        }

        const handle_bulk_actions = (action) => {
            switch (parseInt(action)) {
                case 1:
                    self.deactivateProcess()
                    break;
                case 2:
                    self.deleteCases();
                    break;
                case 3:
                    self.deleteProcess()
                    break;
            }
            if (action !== '') {
                $("#bulkActionSelect").val('')
            }
        }

        const importComponentConfig = {
            iconFiletypes: ['.pmx'],
            showFiletypeIcon: true,
            postUrl: config.apiServer + 'anrupload/upload?workspace=' + config.workspace,
        };
        return (<>
            <a id="export" className="hidden"></a>
            <Card id="content">
                <CardContent>
                    <h5 className={'table-header-title'}>
                        <i className={"fal fa-cogs table-header-icon"}></i>
                        {this.props.t('Process management')}
                        <button className="btn btn_inbox" data-toggle="modal" data-target="#myModal">
                            <i className="fa fa-plus"></i>
                            <span>{this.props.t('Add New Process')}</span>
                        </button>
                        <button className="btn btn_inbox"
                            data-toggle="modal"
                            data-target="#importModal"
                        >
                            <i className="fa fa-upload"></i>
                            <span>{this.props.t('Import')}</span>
                        </button>
                    </h5>
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 p-0">
                            <MaterialDataTable

                                class={"datatable"}
                                columns={[
                                    {
                                        dataField: 'PRO_ID',
                                        headerFormatter: function (cell, item) {
                                            return <select className={'column-filter'} id={'bulkActionSelect'}
                                                onChange={(e) => handle_bulk_actions(e.target.value)}>
                                                <option value={''}>{self.props.t('Bulk actions')}</option>
                                                <option value={'1'}>{self.props.t('Deactivate Process')}</option>
                                                <option
                                                    value={'2'}>{self.props.t('Delete Process Draft Cases')}</option>
                                                <option value={'3'}>{self.props.t('Delete Process')}</option>
                                            </select>
                                        },
                                        text: '',
                                        formatter: function (cell, item) {
                                            return <input className={'case-select'} type={'checkbox'}
                                                value={item.PRO_UID} />
                                        }
                                    },
                                    {
                                        dataField: 'PRO_TITLE',
                                        text: self.props.t('Process name'),
                                        filterable: 'PRO_TITLE',
                                        formatter: function (cell, item) {
                                            return <a target={'_blank'}
                                                href={config.iframeServer + 'designer?prj_uid=' + item.PRO_UID + '&sid=' + localStorage.getItem('session_id')}
                                            >{item.PRO_TITLE}</a>
                                        }
                                    },
                                    {
                                        dataField: 'PRO_CATEGORY_LABEL',
                                        text: self.props.t('Process category'),
                                        filterable: 'PRO_CATEGORY_LABEL'
                                    },
                                    {
                                        dataField: 'PRO_STATUS',
                                        text: self.props.t('Process state'),
                                        filterable: 'PRO_STATUS',
                                        filterOptions: [{
                                            key: 'active',
                                            text: self.props.t('active')
                                        }, {
                                            key: 'inactive',
                                            text: self.props.t('inactive')
                                        }
                                        ],
                                        formatter: function (cell, item) {
                                            return item.PRO_STATUS === 'ACTIVE' ?
                                                <span className='label label-success'>{self.props.t('active')}</span> :
                                                <span className='label label-danger'>{self.props.t('inactive')}</span>
                                        }
                                    },
                                    {
                                        dataField: 'CASES_COUNT',
                                        text: self.props.t('cases count'),
                                        filterable: 'CASES_COUNT'
                                    },
                                    {
                                        dataField: 'CASES_COUNT_COMPLETED',
                                        text: self.props.t('cases count completed'),
                                        filterable: 'CASES_COUNT_COMPLETED'
                                    },
                                    {
                                        dataField: 'actions',
                                        text: self.props.t('actions'),
                                        formatter: function (cell, item) {
                                            return <>
                                                <div
                                                    className={'circle-menu-btn text-center'}
                                                    onClick={() => {
                                                        if (self.state.current_open_menu !== null)
                                                            self.setState({
                                                                current_open_menu: null
                                                            })
                                                        else
                                                            self.setState({
                                                                current_open_menu: item.PRO_UID
                                                            })
                                                    }}>
                                                    <i className="fas fa-ellipsis-v context-menu-toggle"></i>
                                                </div>
                                                {self.state.current_open_menu !== item.PRO_UID ? null :
                                                    <div className={'p-relative'}>
                                                        <div className={'menu-holder2'} onMouseLeave={() => {
                                                            self.setState({
                                                                current_open_menu: null
                                                            })
                                                        }}>
                                                            <ul>
                                                                <li onClick={() => {
                                                                    var message = self.props.t('Do you want to activate this process?');
                                                                    if (item.PRO_STATUS.toUpperCase() === "ACTIVE") {
                                                                        message = self.props.t('Do you want to deactivate this process?');
                                                                    }
                                                                    self.ShowModal(self.props.t('Deactivate Process'), message, "deactivateProcess", [item.PRO_UID])
                                                                }}>
                                                                    <i className={item.PRO_STATUS.toUpperCase() === "ACTIVE" ? "fas fa-stop" : "fas fa-play"} />
                                                                    {item.PRO_STATUS.toUpperCase() === "ACTIVE" ? self.props.t('Deactivate Process') : self.props.t('Activate Process')}
                                                                </li>
                                                                <li onClick={() => {
                                                                    var message = self.props.t('Do you want to delete this process draft cases?');
                                                                    self.ShowModal(self.props.t('Delete Process Draft Cases'), message, "deleteCases", [item.PRO_UID])
                                                                }}>
                                                                    <i className={'fas fa-ban'}></i>
                                                                    {self.props.t('Delete Process Draft Cases')}
                                                                </li>
                                                                <li onClick={() => {
                                                                    var message = self.props.t('Do you want to delete this process?');;
                                                                    self.ShowModal(self.props.t('Delete Process'), message, "deleteProcess", [item.PRO_UID])
                                                                }} >
                                                                    <i className={'fas fa-close'}></i>
                                                                    {self.props.t('Delete Process')}</li>
                                                                <li onClick={() => self.exportProcess(item.PRO_UID)}>
                                                                    <i className={'fas fa-download'}></i>
                                                                    {self.props.t('Export')}</li>
                                                                <li onClick={() => self.handleProcessTask(item.PRO_UID)}>
                                                                    <i className={'fas fa-clock'}></i>
                                                                    {self.props.t('Schedule')}
                                                                </li>
                                                                <li onClick={() => self.handleAssignVariable(item.PRO_UID)}>
                                                                    <i className="fas fa-check-square"></i>
                                                                    {self.props.t('Selected Fields')}</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        }
                                    },
                                ]}
                                items={this.props.data}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="myModalLabel">
                                {this.props.t('New BPMN project')}
                            </h4>
                        </div>
                        <div className="modal-body">
                            <div className="smart-form">
                                <fieldset>
                                    <section>
                                        <span>نام فرآیند</span>
                                        <label className="input">
                                            <i className="icon-append fa fa-question-circle" />

                                            <input
                                                type="text"
                                                placeholder={this.props.t('Title')}
                                                value={this.state.newCategory.title}
                                                onChange={e => this.onChange(e, 0)}
                                            />
                                            <b className="tooltip tooltip-top-right">
                                                <i className="fa fa-warning txt-color-teal" />
                                                {this.props.t('Process Name')}
                                            </b>
                                        </label>
                                    </section>
                                    <section>
                                        <span>{this.props.t("DESCRIPTION")}</span>
                                        <label className="textarea">
                                            <i className="icon-append fa fa-question-circle" />
                                            <textarea
                                                rows="3"
                                                placeholder={this.props.t('Description')}
                                                value={this.state.newCategory.description}
                                                onChange={e => this.onChange(e, 1)}
                                            />
                                            <b className="tooltip tooltip-top-right">
                                                <i className="fa fa-warning txt-color-teal" />
                                                {this.props.t('Process Description')}
                                            </b>
                                        </label>
                                    </section>
                                    <section>
                                        <span>{this.props.t('Process Category')}</span>
                                        <label
                                            className="label"
                                            style={{
                                                textAlign: 'left',
                                                width: '100%',
                                            }}
                                        >

                                        </label>
                                        <label className="select">
                                            <select
                                                value={this.state.newCategory.categoryId}
                                                onChange={e => this.onChange(e, 2)}
                                            >
                                                <option value="0">{this.props.t('No Category')}</option>
                                                {self.props.categories === undefined ? null :
                                                    self.props.categories.map((x, i) => (
                                                        <option key={i} value={x.cat_uid}>
                                                            {this.props.t(x.cat_name)}
                                                        </option>
                                                    ))}
                                            </select>
                                            <i />
                                        </label>
                                    </section>
                                </fieldset>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                {this.props.t('Cancel')}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.InsertNew}
                                data-dismiss="modal"
                            >
                                {this.props.t('Create Process')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="importModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="myImportModalLabel"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="myModalLabel">
                                {this.props.t('Import')}
                            </h4>
                        </div>
                        <div className="modal-body">
                            <div className="smart-form">
                                <fieldset>
                                    <section>
                                        <input name="project_file" id="project_file" type="hidden" />
                                        <DropzoneComponent
                                            config={importComponentConfig}
                                            eventHandlers={uploadEventHandlers}
                                            // djsConfig={this.djsConfig}
                                        />
                                    </section>
                                    <section>
                                        <label
                                            className="label"
                                            style={{
                                                textAlign: 'left',
                                                width: '100%',
                                            }}
                                        >
                                            {this.props.t('Import Options')}
                                        </label>
                                        <label className="select">
                                            <select name="import_option" id="import_option">
                                                <option value="CREATE">
                                                    {this.props.t(
                                                        'Creates a new project and assign new unique IDs to all the objects in the imported project'
                                                    )}
                                                </option>
                                                <option value="OVERWRITE">
                                                    {this.props.t(
                                                        'Overwrites the existing project, keeping the same unique IDs in the imported project'
                                                    )}
                                                </option>
                                                <option value="DISABLE">
                                                    {this.props.t(
                                                        'Disables the existing project and create a new version of the project with new unique IDs assigned to all the objects in the imported project'
                                                    )}
                                                </option>
                                                <option value="KEEP">
                                                    {this.props.t(
                                                        'Keeps the existing project and creates a completely new project with new unique IDs in all the objects of the imported project'
                                                    )}
                                                </option>
                                            </select>
                                            <i />
                                        </label>
                                    </section>
                                </fieldset>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                {this.props.t('Cancel')}
                            </button>
                            {this.state.btn.map(
                                function (station, index) {
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={this.importProject}
                                            id="importBtn"
                                        >
                                            {this.props.t('Import')}
                                        </button>
                                    );

                                    // return <div onClick={this.importProject} className="btn btn-primary"> {this.props.t('Import')}</div>;
                                }.bind(this)
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade-in-up" id="assignVariableModal" role="dialog">
                <div className="modal-dialog modal-full">
                    <div className="modal-content" id="selectFieldBody">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                ×
                            </button>
                            <h4 className="modal-title">{this.props.t('Assign Variable to Cartable')}</h4>
                        </div>
                        <div className="modal-body">
                            {this.state.available_variables.length > 0 ? (
                                <div className="row">
                                    <DualListBox
                                        options={this.state.available_variables}
                                        selected={this.state.assigned_variables}
                                        onChange={this.assignVariables}
                                    />
                                    <div className="col-md-8">{assignedVariables}</div>
                                    <div className="col-md-4">
                                        <button
                                            onClick={this.setDefaultVariable}
                                            className="btn btn-block btn-success"
                                        >
                                            {this.props.t('Set Default Variable')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    <p>{self.props.t('There is no variable')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade-in-up" id="selectProcessTaskModal" role="dialog">
                <div className="modal-dialog modal-full">
                    <div className="modal-content" id="selectFieldBody">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                ×
                            </button>

                            <h4 className="modal-title"> {self.props.t('schedule')} </h4>
                        </div>
                        <div className="modal-body">
                            {this.state.tasks.length > 0 ? (
                                <div>
                                    {mainComponent}

                                    <hr />
                                    {this.renderSwitch(this.state.sch_option)}

                                    <hr />
                                    <button onClick={this.onSubmit.bind(this)} className="form-control">
                                        {self.props.t('Case auto start')}
                                    </button>
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    <p>{self.props.t('There is no variable')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={this.state.modal_open}
                onHide={() => {
                    self.setState({
                        modal_open: false
                    })
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.modal_title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.state.modal_description}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={() => {
                            self.setState({
                                modal_open: false
                            })
                        }}
                    >
                        {this.props.t('return')}
                    </Button>
                    <Button variant="primary"
                        onClick={() => {
                            switch (self.state.modal_action) {
                                case "deactivateProcess":
                                    self.deactivateProcess(self.state.modal_action_data[0])
                                    break;
                                case "deleteCases":
                                    self.deleteCases(self.state.modal_action_data[0])
                                    break;
                                case "deleteProcess":
                                    self.deleteProcess(self.state.modal_action_data[0])
                                    break;
                            }
                            self.setState({
                                modal_open: false
                            })
                        }}
                    >
                        {this.props.t('Confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        )
    }

    ShowModal(title, message, fn, data) {
        this.setState({
            modal_open: true,
            modal_title: title,
            modal_description: message,
            modal_action: fn,
            modal_action_data: data
        });
    }

    InsertNew() {
        const config = this.context;
        let self = this;

        let URL = config.apiServer + 'ProcessExtend/InsertProcess';
        let request = {
            PRO_TITLE: this.state.newCategory.title,
            PRO_DESCRIPTION: this.state.newCategory.description,
            PRO_CATEGORY: this.state.newCategory.categoryId === 0 ? '' : this.state.newCategory.categoryId,
        };
        self.props.insertNew(URL, request);

        // postAuthenticatedJSON(URL, request).then(res => {
        //     self.setState({ data: res });
        // });
    }

    onChange(e, id) {
        let newCategory = this.state.newCategory;
        switch (id) {
            case 0:
                newCategory.title = e.target.value;
                break;
            case 1:
                newCategory.description = e.target.value;
                break;
            case 2:
                newCategory.categoryId = e.target.value;
                break;
        }
        this.setState({ newCategory: newCategory });
    }

    GetProcessList() {
        const config = this.context;
        let self = this;
        let URL = config.apiServer + 'processextend/list';
        self.props.getProcessList(URL);
        self.props.getCategories(config.apiServer + 'project/categories');
    }

    deleteProcess(id = null) {
        const config = this.context;
        SmartMessageBox(
            {
                title: this.props.t('Delete confirm title'),
                content: this.props.t('Delete confirm content message'),
                buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']',
            },
            ButtonPressed => {
                if (ButtonPressed == this.props.t('Yes')) {
                    let self = this;
                    let SelectorSTR = 'input.case-select[type=checkbox]';
                    let processes = this.props.data;
                    if (id === null) {
                        $(SelectorSTR).each(function () {
                            if (this.checked) {
                                URL = config.apiServer + 'project/' + this.value;
                                deleteAuthonticatedJSON(URL)
                                    .then(res => {
                                        processes = processes.filter(x => x.PRO_UID !== this.value);
                                        self.props.setDeleteProcess(processes);
                                    })
                                    .catch(err => {
                                        if (err.status === 200) {
                                            processes = processes.filter(x => x.PRO_UID !== this.value);
                                            self.props.setDeleteProcess(processes);
                                        }
                                    });
                                this.checked = false;
                            }
                        });
                    } else {
                        URL = config.apiServer + 'project/' + id;
                        deleteAuthonticatedJSON(URL)
                            .then(res => {
                                processes = processes.filter(x => x.PRO_UID !== id);
                                self.props.setDeleteProcess(processes);
                                smallBox({
                                    title: this.props.t('Successfully'),
                                    content: '<i>' + this.props.t("The process have been deleted successfully") + '</i>',
                                    color: '#659265',
                                    iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                                    timeout: 4000,
                                });
                            })
                            .catch(err => {
                                if (err.status === 200) {
                                    processes = processes.filter(x => x.PRO_UID !== id);
                                    self.props.setDeleteProcess(processes);
                                } else if (err.status === 400) {
                                    if (err.responseJSON.error !== undefined) {
                                        if (err.responseJSON.error.message.substr(-41) === "can not be deleted, it has started cases.") {
                                            smallBox({
                                                title: this.props.t('Failure'),
                                                content: '<i>' + this.props.t("This process has cases and can't be deleted") + '</i>',
                                                color: '#af0808',
                                                iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                                                timeout: 4000,
                                            });
                                        }
                                    }
                                }
                            });
                        self.setState({
                            current_open_menu: null
                        })
                    }

                }
            }
        );
    }

    onNameChange(e) {
        this.setState({
            sch_name: e.target.value,
        });
    }

    onSChange(e) {
        this.setState({
            sch_option: e.target.value,
        });
    }

    onTaskChange(e) {
        this.setState({
            tas_uid: e.target.value,
        });
    }

    deactivateProcess(id = null) {
        const config = this.context;
        let self = this;
        let ids = [];
        let processes = this.props.data;
        if (id === null) {
            let SelectorSTR = 'input.case-select[type=checkbox]';
            $(SelectorSTR).each(function () {
                if (this.checked) {
                    ids.push(this.value);
                    processes = processes.map(x => {
                        if (x.PRO_UID === this.value) {
                            if (x.PRO_STATUS === 'ACTIVE') {
                                x.PRO_STATUS = 'INACTIVE';
                            } else {
                                x.PRO_STATUS = 'ACTIVE';
                            }
                        }
                        return x;
                    });
                    this.checked = false;
                }
            });
        } else {
            processes = processes.map(x => {
                if (x.PRO_UID === id) {
                    if (x.PRO_STATUS === 'ACTIVE') {
                        x.PRO_STATUS = 'INACTIVE';
                    } else {
                        x.PRO_STATUS = 'ACTIVE';
                    }
                }
                return x;
            });
            ids = [id];
            self.setState({
                current_open_menu: null
            })

        }
        URL = config.apiServer + 'processextend/changestatus';
        let Data = {
            ids: ids,
        };
        self.props.deactivateProcess(URL, Data);
    }

    deleteCases(id = null) {
        let self = this;
        const config = this.context;
        let SelectorSTR = 'input.case-select[type=checkbox]';
        let ids = [];
        // let processes = this.props.data;
        if (id === null) {
            $(SelectorSTR).each(function () {
                if (this.checked) {
                    ids.push(this.value);
                    this.checked = false;
                }
            })
        } else {
            ids = [id]
            self.setState({
                current_open_menu: null
            })
        }
        URL = config.apiServer + 'processextend/bulkdeletecases';
        let Data = {
            ids: ids,
        };
        self.props.deactivateProcessCases(URL, Data, self.props.data);
    }

    handleAssignVariable(id = null) {
        this.getAvailableVariables(id);
        $('#assignVariableModal').modal('show');
    }

    handleProcessTask(id = null) {
        this.getTasks(id);
        $('#selectProcessTaskModal').modal('show');
    }

    getAvailableVariables(id) {
        const config = this.context;
        let self = this;
        if (id === null) {
            let SelectorSTR = 'input.case-select[type=checkbox]';
            $(SelectorSTR).each(function () {
                if (this.checked) {
                    self.getAssignedVariables(this.value);
                    self.setState({ process_id: this.value });
                    getAuthenticatedJSON(config.apiServer + 'anrprocessvariables/' + this.value, {
                        headers: {
                            Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                            'Content-Type': 'application/json',
                        },
                    }).then(res => {
                        let availableVars = [];
                        res.map(item => {
                            availableVars.push({
                                value: item.var_uid,
                                label: item.var_label + ' ( ' + item.var_name + ' )',
                            });
                        });
                        self.setState({ available_variables: availableVars });
                    });
                }
                // return false;
            });
        } else {
            self.getAssignedVariables(id);
            self.setState({ process_id: id });
            getAuthenticatedJSON(config.apiServer + 'anrprocessvariables/' + id, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                let availableVars = [];
                res.map(item => {
                    availableVars.push({
                        value: item.var_uid,
                        label: item.var_label + ' ( ' + item.var_name + ' )',
                    });
                });
                self.setState({ available_variables: availableVars });
            });
            self.setState({
                current_open_menu: null
            })
        }

    }

    getTasks(id) {
        const config = this.context;
        let self = this;
        if (id === null) {
            let SelectorSTR = 'input.case-select[type=checkbox]';
            $(SelectorSTR).each(function () {
                if (this.checked) {
                    self.getAssignedVariables(this.value);

                    self.setState({ process_id: this.value });
                    self.setState({ prj_uid: this.value });

                    getAuthenticatedJSON(config.apiServer + 'arian/tsk/' + this.value, {
                        headers: {
                            Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                            'Content-Type': 'application/json',
                        },
                    }).then(res => {
                        let task = [];
                        res.map(item => {
                            task.push({
                                value: item.TAS_UID,
                                label: item.TAS_TITLE,
                            });
                        });
                        self.setState({ tasks: task });
                    });
                }
                // return false;
            });
        } else {
            self.getAssignedVariables(id);

            self.setState({ process_id: id });
            self.setState({ prj_uid: id });

            getAuthenticatedJSON(config.apiServer + 'arian/tsk/' + id, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                let task = [];
                res.map(item => {
                    task.push({
                        value: item.TAS_UID,
                        label: item.TAS_TITLE,
                    });
                });
                self.setState({ tasks: task });
            });

            self.setState({
                current_open_menu: null
            })

        }

    }

    getAssignedVariables(process_id) {
        const config = this.context;
        let self = this;
        getAuthenticatedJSON(config.apiServer + 'anrprocessvariables/assigned-variables/' + process_id, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
        }).then(res => {
            // res
            self.setGroupsMembers(res);
        });
    }

    assignVariables(selected) {
        let available_variables = this.state.available_variables;
        let prevSelect = this.state.assigned_variables;

        if(selected.length > prevSelect.length){
         let newFields= selected.filter(item => !prevSelect.includes(item));
         this.assignVariable(newFields,selected);
        }
        else if(selected.length < prevSelect.length){
            let removeFields = prevSelect.filter(item => !selected.includes(item));
             this.unassignVariable(removeFields,selected);
        }
    }

    assignVariable(variables,selected) {
        const config = this.context;
            let varb_promise = [];
            let self = this;
            variables.map((varb, index) => {
                varb_promise[index] = postAuthenticatedJSON(config.apiServer + 'anrprocessvariables/assign-variable', {
                    var_uid: varb,
                    process_uid: self.state.process_id,
                })
            });
            Promise.all([...varb_promise])
                .then(res => {
                   smallBox({
                    title: this.props.t('Successfully'),
                    content: '<i>' + this.props.t("Data has been saved successfully") + '</i>',
                    color: '#659265',
                    iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                    timeout: 4000,
                });
                this.setState({ assigned_variables: selected });
                
                })

        .catch (e => {
            smallBox({
                title: this.props.t('Failure'),
                content: '<i>' + this.props.t("INTERNAL SERVER ERROR") + '</i>',
                color: 'red',
                iconSmall: 'fa fa-times fa-2x fadeInRight animated',
                timeout: 4000,
            });
        })

    };

    unassignVariable(unassigned, selected) {
        const config = this.context;
            let varb_promise = [];
            let self = this;
            unassigned.map((varb, index) => {
                varb_promise[index] = postAuthenticatedJSON(config.apiServer + 'anrprocessvariables/unassign-variable', {
                    var_uid: varb,
                    process_uid: self.state.process_id,
                })
            });
            Promise.all([...varb_promise])
                .then(res => {
                    smallBox({
                        title: this.props.t('Successfully'),
                        content: '<i>' + this.props.t("Data has been saved successfully") + '</i>',
                        color: '#659265',
                        iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                        timeout: 4000,
                    });

                    this.setState({ assigned_variables: selected });

                })

        .catch (e => {
            smallBox({
                title: this.props.t('Failure'),
                content: '<i>' + this.props.t("INTERNAL SERVER ERROR") + '</i>',
                color: 'red',
                iconSmall: 'fa fa-times fa-2x fadeInRight animated',
                timeout: 4000,
            });
        })

    };

    setDefaultVariable() {
        const config = this.context;
        let self = this;
        let var_uid = $('#default_variable').val();
        postAuthenticatedJSON(config.apiServer + 'anrprocessvariables/set-default-variable', {
            var_uid: var_uid,
            process_uid: self.state.process_id,
        }).then(res => {
            if (res.statusCode == 200) {
                smallBox({
                    title: this.props.t('Successfully'),
                    content: '<i>' + this.props.t('Data has been saved successfully') + '</i>',
                    color: '#659265',
                    iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                    timeout: 4000,
                });
            }
        });
    }

    setGroupsMembers = data => {
        let a = [];
        data.map(d => {
            a.push(d.var_uid);
        });

        this.setState({ assigned_variables: a });
    };
}

export default compose(
    withTranslation(),
    connect(state => state.processManagement, Actions)
)(ProcessManagement);
