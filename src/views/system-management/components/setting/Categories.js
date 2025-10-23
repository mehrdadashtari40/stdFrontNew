import React from 'react'
import Form from "../../utils/CategoryForm";
import {config}  from '../../../../config/config';
import $ from 'jquery';
import getAuthonticatedJSON from '../../../../common/utils/functions/getAuthenticatedJSON';
import { connect } from 'react-redux';
import * as Actions from '../../SystemManagementActions';
import { withTranslation } from 'react-i18next';
import {compose} from 'redux';
import MaterialDataTable from "../../../../common/tables/components/MaterialDataTable";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import {smallBox, SmartMessageBox} from "../../../../common/utils/functions";
import deleteAuthonticatedJSON from "../../../../common/utils/functions/deleteAuthonticatedJSON";
 class Categories extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Edit: false,
			Show: [],
			refresh: false,
		};
		this.handelIndex = this.handelIndex.bind(this);
		this.handelCreate = this.handelCreate.bind(this);
		this.handelShow = this.handelShow.bind(this);
		this.handelDelete = this.handelDelete.bind(this);
	}
	componentDidMount() {
		let self = this;
		this.handelIndex();
		$('#CategoryBox').on('hidden.bs.modal', function () {
			self.handelIndex();
			// document.getElementById("new-role-form").reset();
		})

	}
	handelIndex() {
		this.props.loadCategories(config.apiServer + 'project/categories');
		this.setState({Edit: false});
	}
	handelCreate() {
		$("input[name=cat_uid]").val("")
		$("input[name=cat_name]").val("")
		$('#CategoryBox').modal('show');
	}
	handelShow(data) {
		getAuthonticatedJSON(config.apiServer + 'project/category/' + data['cat_uid'],
			{
				headers: {
					"Authorization": "Bearer " + localStorage.getItem('access_token'),
					'Content-Type': 'application/json'
				}
			}).then((res) => {
			this.setState({Show: res});
			$('#CategoryBox').modal('show');
			this.SetData();
			// this.disableFields();

		});

	}
	handelDelete(item){
		 let self = this;
		 SmartMessageBox({
			 title: this.props.t('Delete confirm title'),
			 content: this.props.t('Delete confirm content message'),
			 buttons: '[' + this.props.t('No') + '][' + this.props.t('Yes') + ']'
		 }, (ButtonPressed) => {
			 if (ButtonPressed === this.props.t('Yes')) {
				 let catId = item.cat_uid;
				 deleteAuthonticatedJSON(config.apiServer + 'project/category/'+catId).then((res)=>{
					 smallBox({
						 title: this.props.t('Successfully'),
						 content: "<i>"+this.props.t('The category have been deleted successfully')+"</i>",
						 color: "#659265",
						 iconSmall: "fa fa-check fa-2x fadeInRight animated",
						 timeout: 4000
					 });
					 $('#CategoryBox').modal('hide');
					 self.props.setCategories(self.props.Categories.filter(x=>x.cat_uid !== item.cat_uid));
				 }).catch(error=>{
				 	if(error.responseJSON.error !== undefined){
						smallBox({
							title: this.props.t('Failure'),
							content: "<i>"+this.props.t(error.responseJSON.error.message)+"</i>",
							color: "#af0808",
							iconSmall: "fa fa-check fa-2x fadeInRight animated",
							timeout: 4000
						});
					}

				 });
			 }
		 });
	 }
	SetData() {
		let data = this.state.Show;
		$("input[name=cat_uid]").val(data['cat_uid']);
		$("input[name=cat_name]").val(data['cat_name']);
	}
    render() {
		let self = this;
        return (
            <>
				<Card id="content">
					<CardContent>
						<h5 className={'table-header-title'}>
							<i className={"fal fa-cogs table-header-icon"}></i>
							{this.props.t('Process categories')}
							<button className="btn btn_inbox" onClick={this.handelCreate}>
								<i className="fa fa-plus" />
								<span>{this.props.t('Add New Category')}</span>
							</button>
						</h5>

						<div className="row">
							<div className="col-sm-12 col-md-12 col-lg-12 p-0">
								<MaterialDataTable
									items={this.props.Categories}
									columns={[
										{
											dataField: 'cat_name',
											text: this.props.t('Category Title'),
											filterable: 'cat_name',
											formatter: function (cell, item) {
												return <div className="text-primary" data-id={item.id}><b>{item.cat_name}</b></div>
											}
										},
										{
											dataField: 'cat_total_processes',
											text: this.props.t('PROCESS Count'),
											filterable: 'cat_total_processes'
										},
										{
											dataField: 'actions',
											text: this.props.t('actions'),
											formatter: function (cell, item) {
												return (<div className={'table-actions'}>
													<i className={'fas fa-edit'}
													   onClick={() => self.handelShow(item)}
													/>
													<i className={'fas fa-trash'}
													   onClick={() => self.handelDelete(item)}
													/>
												</div>)
											}
										},
									]}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
                <div className="modal fade-in-up" id="CategoryBox" role="dialog" >
                    <div className="modal-dialog">
                        <div className="modal-content" id="CategoryBoxBody">
                            <Form  Refresh={this.handelIndex} Edit={this.state.Edit} Data={this.state.Show}/>
                        </div>
                    </div>
                </div>
            </>
        )
	}
}

export default compose( withTranslation(),connect(state => state.systemManagement, Actions))(Categories);
