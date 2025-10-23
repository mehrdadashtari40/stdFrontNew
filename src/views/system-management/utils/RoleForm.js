import React from 'react'
import postRequest from "../../../components/utils/postRequest";
import putRequest from "../../../components/utils/putRequest";
import deleteRequest from "../../../components/utils/deleteRequest";
import {smallBox,SmartMessageBox} from "../../../components/utils/actions/MessageActions";
import {config}  from '../../../config/config';
import { withTranslation } from 'react-i18next';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Update:false,
            RoleId:""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handelUpdate = this.handelUpdate.bind(this);
        this.handelDelete = this.handelDelete.bind(this);
    }
    componentWillReceiveProps(newProps) {
        if(newProps.Edit)
            this.setState({Update: true});
             this.setState({RoleId: newProps.Data['rol_uid']});
    }

    onSubmit(evt) {
        evt.preventDefault();
        let self = this;
        let url=config.apiServer + 'role';
        const formData = Array.from(evt.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({...a, [b.name]: b.value}), {});
        if(this.state.Update) {
            putRequest(url+'/'+formData['rol_uid'],
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
                document.getElementById("new-role-form").reset();
                $('#RoleBox').modal('hide');
                self.props.Refresh();

            });
        }else {
            delete formData['rol_uid'];
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
                document.getElementById("new-role-form").reset();
                //$('#RoleBox').modal('hide');
                self.props.Refresh();

            })
        }
    }
    handelDelete(){
	    SmartMessageBox({
		    title: this.props.t('Delete confirm title'),
		    content: this.props.t('Delete confirm content message'),
		    buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']'
	    }, (ButtonPressed) => {
		    if (ButtonPressed == this.props.t('Yes')) {
			    let roleId = $("#rol_uid").val();
			    deleteRequest(config.apiServer + 'role/'+roleId,{
				    headers : {
					    "Authorization" : "Bearer " + localStorage.getItem('access_token'),
				    }
			    }).then((res)=>{
				    smallBox({
					    title: this.props.t('Successfully'),
					    content: "<i>"+this.props.t('Data has been saved successfully')+"</i>",
					    color: "#659265",
					    iconSmall: "fa fa-check fa-2x fadeInRight animated",
					    timeout: 4000
				    });
				    $('#RoleBox').modal('hide');
			    });
                }
	    })
    }

    handelUpdate(){
            this.setState({Update: true});
            this.props.Enable();

    }
    render() {
        return (
            <form id="new-role-form" className="smart-form" noValidate="novalidate" onSubmit={this.onSubmit}>

                <fieldset>
                    <input type="hidden" name="rol_uid" id="rol_uid"/>
                    <div className="row">
                    <section className="modal_option_bar">
                            <div id="actions">                            
                            <nav className="modal_option_bx">
                            <div className="modal_option_item">
                                        <a onClick={this.handelUsers} className="btn btn-primary" >
                                            <span className="fa fa-users"/>   {  this.props.t('Users') }
                                            </a>
                                        </div>
                                        <div className="modal_option_item">
                                        <a onClick={this.props.Permission} className="btn btn-info" >
                                            <span className="fa fa-lock"/>   {  this.props.t('Permissions') }
                                            </a>
                                        </div>
                                        <div className="modal_option_item">
                                        <a onClick={this.handelUpdate} className="btn btn-warning" >
                                            <span className="fa fa-edit"/>   {  this.props.t('Edit') }
                                            </a>
                                        </div>
                                        <div className="modal_option_item">
                                        <a onClick={this.handelDelete} className="btn btn-danger">
                                            <span className="fa fa-remove"/>{  this.props.t('Delete') }
                                        </a>
                                   </div>
                                    </nav>
                            </div>
                        </section>
                        <section className="col-sm-12">
                            <label className="input"> <i className="icon-prepend fa fa-code"/>
                                <input type="text" name="rol_code" id="rol_code" placeholder={  this.props.t('Code') }/>
                            </label>
                        </section>                                        
                        <section className="col-sm-6">
                            <label className="input"> <i className="icon-prepend fa fa-sort-alpha-asc"/>
                                <input type="text" name="rol_name" placeholder={  this.props.t('Name') }/>
                            </label>
                        </section>
                        <section className="col-sm-6">
                            <label className="select">
                                <select name="rol_status">
                                    <option value="0" defaultValue disabled>{  this.props.t('Status') }</option>
                                    <option value="ACTIVE">{  this.props.t('Active') }</option>
                                    <option value="INACTIVE">{  this.props.t('InActive') }</option>
                                </select> <i/> </label>
                        </section>
                    </div>
                </fieldset>
                <footer>
                    <button type="submit" className="btn btn-success"><i className="fa fa-check"></i>
                        {  this.props.t('Submit') }
                    </button>
                </footer>
            </form>
        )
    }
}

export default withTranslation()(Form);