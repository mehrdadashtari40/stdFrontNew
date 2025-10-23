import React from 'react'
import $ from 'jquery';
import {config} from '../../../config/config';
import putRequest from '../../../common/utils/functions/putRequest';
import {smallBox, SmartMessageBox} from '../../../common';
import postAuthenticatedJSON from '../../../common/utils/functions/postAuthenticatedJSON';
import {withTranslation} from 'react-i18next';
import deleteAuthonticatedJSON from "../../../common/utils/functions/deleteAuthonticatedJSON";

class DepartmentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Update: false,
            DepartmentId: "",
            parent: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handelUpdate = this.handelUpdate.bind(this);
        this.handelDelete = this.handelDelete.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({parent: newProps.Parent});
        if (newProps.Edit)
            this.setState({Update: true});
        this.setState({DepartmentId: newProps.Data['dep_uid']});
    }

    onSubmit(evt) {
        evt.preventDefault();
        let self = this;
        if (!self.checkDepTitle()) {
            return;
        }

        let url = config.apiServer + 'department';
        const formData = Array.from(evt.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({...a, [b.name]: b.value}), {});
        if (this.state.Update) {
            putRequest(url + '/' + formData['dep_uid'],
                {
                    body: JSON.stringify(formData),
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem('access_token'),
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                smallBox({
                    title: this.props.t('Successfully'),
                    content: "<i>" + this.props.t('Data has been saved successfully') + "</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                document.getElementById("new-department-form").reset();
                $('#DepartmentBox').modal('hide');
                self.props.Refresh();

            });
        } else {
            delete formData['dep_uid'];
            postAuthenticatedJSON(url,
                {
                    body: JSON.stringify(formData),
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem('access_token'),
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                smallBox({
                    title: this.props.t('Successfully'),
                    content: "<i>" + this.props.t('Data has been saved successfully') + "</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                document.getElementById("new-department-form").reset();
                self.props.Refresh();

            })
        }
    }

    handelDelete() {
        SmartMessageBox({
            title: this.props.t('Delete confirm title'),
            content: this.props.t('Delete confirm content message'),
            buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']'
        }, (ButtonPressed) => {
            if (ButtonPressed === this.props.t('Yes')) {
                let departmentId = $("#dep_uid").val();
                deleteAuthonticatedJSON(config.apiServer + 'department/' + departmentId).then((res) => {
                    smallBox({
                        title: this.props.t('Successfully'),
                        content: "<i>" + this.props.t('Data has been saved successfully') + "</i>",
                        color: "#659265",
                        iconSmall: "fa fa-check fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                    $('#DepartmentBox').modal('hide');
                });
            }
        });

    }

    handelUpdate() {
        this.setState({Update: true});
        this.props.Enable();

    }

    checkDepTitle = () => {
        // $(passwordValidationMsg)
        const depTitle = $('#dep_title').val();
        // if(depTitle.length > 0){
        if (depTitle) {
            return true;
        } else {
            $('#dep_title_msg').text(this.props.t('Required Department Title'));
            setTimeout(() => {
                $('#dep_title_msg').text('');
            }, 20000);
            return false;
        }
    }

    render() {
        return (
            <form id="new-department-form" className="smart-form" noValidate="novalidate" onSubmit={this.onSubmit}>

                <fieldset>
                    <input type="hidden" name="dep_uid" id="dep_uid"/>
                    <div className="row">
                        <section className="modal_option_bar">
                            <div id="actions">
                                <nav className="modal_option_bx">
                                    <div className="modal_option_item">
                                        <a href={'#'} onClick={this.handelUpdate} className="btn btn-warning">
                                            <span className="fa fa-edit"/> {this.props.t('Edit')}
                                        </a>
                                    </div>
                                    <div className="modal_option_item">
                                        <a onClick={this.handelDelete} className="btn btn-danger">
                                            <span className="fa fa-remove"/>{this.props.t('Delete')}
                                        </a>
                                    </div>
                                </nav>
                            </div>
                        </section>
                        <section className="col-sm-12">
                            <label className="input"> <i className="icon-prepend fa fa-star"/>
                                <input type="text" name="dep_title" id="dep_title"
                                       placeholder={this.props.t('Department Name')}/>
                            </label>
                            <div className="help-block text-danger" style={{color: '#d44950'}} id="dep_title_msg"></div>
                        </section>

                    </div>
                    <div className="row">
                        <input type="hidden" name="dep_parent"/>
                        <section className="col col-6">
                            <label className="select">
                                <select name="dep_status">
                                    <option value="0" defaultValue disabled>{this.props.t('Status')}</option>
                                    <option value="ACTIVE" selected="selected">{this.props.t('Active')}</option>
                                    <option value="INACTIVE">{this.props.t('InActive')}</option>
                                </select> <i/> </label>
                        </section>

                    </div>


                </fieldset>

                <footer className="modal-footer">
                    <button type="submit" className="btn btn-success"><i className="fa fa-check"></i>
                        {this.props.t('Submit')}
                    </button>
                </footer>
            </form>
        )
    }
}

export default withTranslation()(DepartmentForm);