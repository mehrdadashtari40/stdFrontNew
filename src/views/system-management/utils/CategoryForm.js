import React from 'react'

import {config} from '../../../config/config';
import $ from 'jquery';
import {smallBox, SmartMessageBox} from '../../../common';
import {withTranslation} from 'react-i18next';
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";
import putAuthonticatedJSON from "../../../common/utils/functions/putAuthonticatedJSON";

class CategoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Update: true,
            CategoryId: "",
            CategoryMembers: [],
            Users: []
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handelUpdate = this.handelUpdate.bind(this);
    }

    onSubmit(evt) {
        evt.preventDefault();
        let self = this;
        let url = config.apiServer + 'project/category';
        const formData = Array.from(evt.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({...a, [b.name]: b.value}), {});
        if ($("#cat_uid").val() !== "") {
            putAuthonticatedJSON(url + '/' + formData['cat_uid'],formData).then((res) => {
                smallBox({
                    title: this.props.t('Successfully'),
                    content: "<i>" + this.props.t('Data has been saved successfully') + "</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                document.getElementById("new-category-form").reset();
                $('#CategoryBox').modal('hide');
                self.props.Refresh();
            });
        } else {
            postAuthenticatedJSON(url,formData).then((res) => {
                smallBox({
                    title: this.props.t('Successfully'),
                    content: "<i>" + this.props.t('Data has been saved successfully') + "</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                document.getElementById("new-category-form").reset();
                self.props.Refresh();
                $('#CategoryBox').modal('hide');
            })
        }
    }

    handelUpdate() {
        this.setState({Update: true});
    }

    render() {
        return (
            <form id="new-category-form" className="smart-form" noValidate="novalidate" onSubmit={this.onSubmit}>
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title"> {this.props.t('Add/Edit Category')}</h4>
                </div>
                <fieldset>
                    <input type="hidden" name="cat_uid" id="cat_uid"/>
                    <div className="row">
                        <section className="col-sm-12">
                            <label className="input"> <i className="icon-prepend fa fa-star"/>
                                <input type="text" name="cat_name" id="cat_name"
                                       placeholder={this.props.t('Category Name')}/>
                            </label>
                        </section>
                    </div>
                </fieldset>
                <footer>
                    <button type="submit" className="btn btn-success"><i className="fa fa-check"></i>
                        {this.props.t('Submit')}
                    </button>
                </footer>
            </form>
        )
    }
}

export default withTranslation()(CategoryForm);