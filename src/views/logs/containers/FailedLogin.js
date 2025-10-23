/**
 * Created by griga on 11/30/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import jMoment from 'moment-jalaali';
import * as Actions from '../LogActions';
import { config } from '../../../config/config';
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import Datatable from "../../../common/tables/components/Datatable2";
import WidgetGrid from "../../../common/widgets/components/WidgetGrid";
import JarvisWidget from "../../../common/widgets/components/JarvisWidget";

class FailedLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
		};
	}
	componentDidMount() {
        getAuthonticatedJSON(config.apiServer+"userextend/get-my-uid")
        .then(userUid=>{
            this.props.loadAllLogs(
                config.logsUrls,
                'Basic ' + btoa('9ffaf364-7362-4089-a390-3e3b3801daa5' + ':' + 'session'),
                0,
                15,
                'FailedLogin ' +  '&& ' +  'usrUid:' + userUid
                
            );
        })
	}
	

	render() {
		let self = this;
		let dataTable = null;
		let options = {
			data: this.props.logs.allLogData,
			iDisplayLength: 10,
			columns: [
				{
					class: 'service-id hidden',
					orderable: false,
					data: null,
					defaultContent: '',
					render: function(data) {
						return "<input class='case-select' type='checkbox' value='" + data.message.logType + "'>";
					},
				},
				{
					class: 'text-center row-controller open-case',
					data: null,
					render: function(data) {
						let date = jMoment(data.message.timestamp).format('jYYYY/jMM/jDD');
						let time = jMoment(data.message.timestamp).format('HH:mm:ss');
						if (data.message != null)
							return '<div> ' + date + '<br /> <small class="text-muted" > ' + time + ' </small></div>';
					},
				},
				{
					class: 'text-center row-controller open-case',
					data: null,
					render: function(data) {
						if (data.message != null) return '<div>' + data.message.logType + ' <br /> </div>';
					},
				},
				{
					class: 'text-center row-controller open-case',
					
					data: null,
					render: function(data) {
						if (data.message.IP != null){
							 return '<div>' + data.message.IP + '</div> '
							}else {
								return '<div>' + 'ثبت نشده' + '</div> '
							}
					},
				},
				{
					class: 'text-center row-controller open-case',
					data: null,
					render: function(data) {
						if (data.message.workspaces != null) {
							return '<div>' + data.message.workspaces + '</div> '
					}else {
						return '<div>' + 'ثبت نشده' + '</div> '

					}
					},
				},

				{
					class: 'text-center row-controller open-case',
					data: null,
					render: function(data) {
						if (data.message.usrUid == 'Undefined user'){
							return '<div>' + 'نامشخص' + '</div> '
						}
						if (data.message.usrUid != null) {
							return '<div>' + data.message.usrUid + '</div> '
						}else {
							return '<div>' + 'ثبت نشده' + '</div> '

						}
					},
				},
				{
					class: 'text-center row-controller open-case',
					data: null,
					render: function(data) {
						if (data.message != null){
							if (data.message.statusMessage === 'SuccessfulLogin'){
								return "<span class='label label-success'>" + self.props.t(data.message.statusMessage) + "</span>"
							}
							else {
								return "<span class='label label-danger'>" + self.props.t(data.message.statusMessage) + "</span>"
							}
						
						}
					},
				},
				
				{
					class: 'hide id',
					data: null,
					render: function(data) {
						return data.app_uid + '/' + data.del_index;
					},
				},
			],
			order: [[2, 'desc']],
			rowID: '.hide.id',
			buttons: false,
		};
		dataTable = (
			<Datatable
				options={options}
				className="display projects-table table table-striped table-bordered table-hover"
				cellSpacing="0"
				width="100%"
				paginationLength={true}
				filter={true}
			>
				<thead>
					<tr>
						<th className="hidden" />

						<th className=" text-center hasinput">
							<input
								type="text"
								className=" text-center form-control"
								placeholder={self.props.t('Filter Log Create Date')}
							/>
						</th>
						<th className="text-center hasinput" style={{ width: '7%' }}>
							<input
								id="dateselect_filter"
								type="text"
								placeholder={self.props.t('Filter Log Type')}
								className="text-center form-control datepicker"
								data-dateformat="yy/mm/dd"
							/>
						</th>
						<th className="text-center hasinput" style={{ width: '10%' }}>
							<input
								id="dateselect_filter"
								type="text"
								className=" text-center form-control"
								placeholder={self.props.t('Filter IP')}
							/>
						</th>
						<th className="hasinput" style={{ width: '10%' }}>
							<input
								type="text"
								className=" text-center form-control"
								placeholder={self.props.t('Filter WorkSpace')}
							/>
						</th>
						<th className="hasinput" style={{ width: '10%' }}>
							<input
								type="text"
								className=" text-center form-control"
								placeholder={self.props.t('Filter User ID')}
							/>
						</th>
						<th className="hasinput" style={{ width: '10%' }}>
							<input
								type="text"
								className="text-center form-control"
								placeholder={self.props.t('Filter Status')}
							/>
						</th>

						<th className="hidden" />
					</tr>
					<tr>
						<th className="text-center" style={{ width: '10%' }}>
							<i className="fa fa-fw fa-calendar text-muted hidden-md hidden-sm hidden-xs" />
							{self.props.t('')}
						</th>
						<th className="text-center" style={{ width: '10%' }}>
							<i className="fa fa-fw fa-calendar text-muted hidden-md hidden-sm hidden-xs" />
							{self.props.t('Log Create Date')}
						</th>
						<th className="text-center" style={{ width: '10%' }}>
							<i className="fa fa-fw fa-calendar text-muted hidden-md hidden-sm hidden-xs" />
							{self.props.t('Log Type')}
						</th>
						<th className="text-center" style={{ width: '10%' }}>
							<i className="fa fa-fw fa-calendar text-muted hidden-md hidden-sm hidden-xs" />
							{self.props.t('IP')}
						</th>
						<th className="text-center" style={{ width: '10%' }}>
							<i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs" />
							{self.props.t('WorkSpace')}
						</th>
						<th className="text-center" style={{ width: '10%' }}>
							<i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs" />
							{self.props.t('User ID ')}
						</th>
						<th className="text-center" style={{ width: '5%' }}>
							<i className="fa fa-battery-three-quarters text-muted hidden-md hidden-sm hidden-xs" />
							{self.props.t('Status')}
						</th>
						{/* <th className="text-center" style={{"width": "10%"}}>
							<i className="text-muted hidden-md hidden-sm hidden-xs"/>
							{self.props.t('Case Number')}
						</th>
						<th className="text-center" style={{"width": "10%"}}>
							<i className="text-muted hidden-md hidden-sm hidden-xs"/>
							{self.props.t('Case')}
						</th> */}
						
					</tr>
				</thead>
			</Datatable>
		);

		return (
			<div id="content">
				<div className="row">
					{/*<BigBreadcrumbs*/}
					{/*	items={['Logs' , 'لاگین های ناموفق']}*/}
					{/*	icon="fa fa-fw fa-circle-o-notch"*/}
					{/*	className="col-xs-12 col-sm-7 col-md-7 col-lg-4"*/}
					{/*/>*/}
				</div>
				<WidgetGrid>
					<div className="row">
						<article className="col-sm-12 col-md-12 col-lg-12">
						
							<JarvisWidget
								togglebutton={false}
								editbutton={false}
								colorbutton={false}
								deletebutton={false}
								fullscreenbutton={true}
							>
									<div className="col-md-12 border-box">
										<div className="margin-top-10">
											<div className="table-wrap custom-scroll"> {dataTable}</div>
										</div>
									</div>
								<a
									id="compose-mail-mini"
									className="btn btn-primary pull-right hidden-desktop visible-tablet"
								>
									<strong>
										<i className="fa fa-file fa-lg" />
									</strong>
								</a>
							</JarvisWidget>
						</article>
					</div>
				</WidgetGrid>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return state;
};

export default connect(mapStateToProps, Actions)(FailedLogin);
