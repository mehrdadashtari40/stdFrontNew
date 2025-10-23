import React from 'react'
import { config } from '../../../config/config';
import putRequest from '../../../common/utils/functions/putRequest';
import { smallBox, SmartMessageBox } from '../../../common';
import postRequest from '../../../common/utils/functions/postRequest';
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import deleteAuthonticatedJSON from "../../../common/utils/functions/deleteAuthonticatedJSON";


export default class RoleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Update:false,
            roleID:"",
            GroupMembers:[],
            Users:[]
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handelUpdate = this.handelUpdate.bind(this);
        this.handelDelete = this.handelDelete.bind(this);
        this.getGroupMembers = this.getGroupMembers.bind(this);
    }
    componentWillReceiveProps(newProps) {
          if(this.props.getUsers !== newProps.getUsers)
	          this.getGroupMembers();
        if(newProps.Edit)
            this.setState({Update: true});
             this.setState({RoleID: newProps.Data['ROL_UID']});
    }

    onSubmit(evt) {
        evt.preventDefault();
        let self = this;
        let url=config.apiServer + 'biarian/bi-role';
        const formData = Array.from(evt.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({...a, [b.name]: b.value}), {});
        if(this.state.Update) {
            putRequest(url+'/'+formData['ROL_UID'],
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
                $('#GroupBox').modal('hide');
                self.props.Refresh();

            });
        }else {
            //delete formData['usr_uid'];
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
                //$('#GroupBox').modal('hide');
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
			    let roleId = $("#ROL_UID").val();
                deleteAuthonticatedJSON(config.apiServer + 'biarian/bi-role/'+roleId).then((res)=>{
				    smallBox({
					    title: this.props.t('Successfully'),
					    content: "<i>"+this.props.t('Data has been saved successfully')+"</i>",
					    color: "#659265",
					    iconSmall: "fa fa-check fa-2x fadeInRight animated",
					    timeout: 4000
				    });
				    $('#GroupBox').modal('hide');
			    });
		    }
	    });
    }

    handelUpdate(){
            this.setState({Update: true});
            this.props.Enable();

    }

    getGroupMembers(){
        let grpId = $("#grp_uid").val();
        let self = this;
        getAuthonticatedJSON(config.apiServer + 'group/'+ grpId + '/users').then((res)=> {
            self.props.setGroupsMembers(res);

        });
    }


    render() {
        return (
            <form id="new-user-form" className="smart-form" noValidate="novalidate" onSubmit={this.onSubmit}>

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
                        <section className="col-sm-6">
                            <label className="input"> <i className="icon-prepend fa fa-user"/>
                                <input type="text" name="ROL_CODE" id="ROL_CODE" placeholder={  this.props.t('ROL_CODE') }/>
                            </label>
                        </section> 
                        <section className="col-sm-6">
                            <label className="input"> <i className="icon-prepend fa fa-user"/>
                                <input type="text" name="ROL_NAME" id="ROL_NAME" placeholder={  this.props.t('ROL_NAME') }/>
                            </label>
                        </section>                                               
                        <section className="col-sm-6">
                            <label className="select">
                                <select name="ROL_STATUS">
                                    <option value="-1" defaultValue disabled>{  this.props.t('Status') }</option>
                                    <option value="1">{  this.props.t('Active') }</option>
                                    <option value="0">{  this.props.t('InActive') }</option>
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