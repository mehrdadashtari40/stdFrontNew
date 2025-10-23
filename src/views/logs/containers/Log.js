/**
 * Created by griga on 11/30/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import jMoment from 'moment-jalaali';
import * as Actions from '../LogActions';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import MaterialDataTable from "../../../common/tables/components/MaterialDataTable";
import {Modal, Table} from "react-bootstrap";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

class Log extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			detail_modal_open:false,
			detail_raw:null,
			detail: [],
			current_log_type:null
		};
	}
	componentDidMount() {
		this.displayData = this.displayData.bind(this);
	}

	get_logs_list(self) {
		var endDate = new Date();
		var startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDay()-7);
		let params = [
			'{job="'+self.props.match.params.type+'"}'
		];
		self.props.loadAllLogs(params,Math.floor(startDate.getTime()/1000),Math.floor(endDate.getTime()/1000),self.props.match.params.type);
	}

	render() {
    	let self = this;

    	if(this.props.current_log_type !== this.props.match.params.type){
			this.get_logs_list(this)
		}
		let dataTable = null;
		return  (<>
			<MaterialDataTable
				icon={'fas fa-history'}
				title={self.props.t('LOGS')}
				items={this.props.allLogData}
				columns={[
					{
						dataField: 'time',
						formatter: function(cell,data) {
							let date = jMoment(data.timeZone).format('jYYYY/jMM/jDD');
							let time = jMoment(data.timeZone).format('HH:mm:ss');
							return <div>{date}<br /> <small className="text-muted" >{time}</small></div>;
						},
						text: self.props.t('TIME'),
						filterable: 'timeZone'
					},
					{
						dataField: 'type',
						text: self.props.t('Log Type'),
						filterable: 'type'
					},
					{
						dataField: 'value',
						text: self.props.t('Log value'),
						filterable: 'value'
					},
					{
						dataField: 'workspace',
						text: self.props.t('Workspace'),
						filterable: 'workspace'
					},
					{
						text: self.props.t('DESCRIPTION'),
						formatter: function(ind,data) {
							return <button onClick={()=>self.displayData(data.data,data.raw)} type={'button'} className={'btn btn-primary'} >جزئیات</button>;
						},
					}
				]}
				// getDataList={data => this.getUsers(data)}
				/>
			<Modal show={this.state.detail_modal_open} onHide={()=>{
				self.setState({
					detail_modal_open:false
				})
			}}>
				<Modal.Header closeButton>
					جزئیات لاگ
				</Modal.Header>
				<Modal.Body className={'p-0'}>
					<Table  striped bordered hover size="sm" responsive>
						<thead>
						<tr>
							<th>key</th>
							<th>value</th>
						</tr>
						</thead>
						<tbody>
						{this.state.detail === null?null:Object.entries(this.state.detail).map(x=>{
							return <tr><td>{x[0]}</td><td>{x[1]}</td></tr>
						})}
						</tbody>
					</Table>
					<div className={'p-3'}>
						<pre style={{direction:'ltr',margin:'10px'}}>
					{this.state.detail_raw}
					</pre>
					</div>
				</Modal.Body>
			</Modal>
				</>);
	}

	displayData(data,raw) {
    	this.setState({
			detail_modal_open:true,
			detail_raw:raw,
			detail:data
    	})
	}
}
export default compose(
	withTranslation(),
	connect(state => state.logs, Actions)
)(Log);
