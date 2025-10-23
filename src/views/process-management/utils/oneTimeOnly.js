import React, { Component } from 'react';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import * as Actions from "../ProcessManagementActions";

class oneTimeOnly extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sch_start_time: '',
		};
	}
	onTimeChange(e) {
		this.setState({ sch_start_time: e.target.value });
	}
	render() {
		return (
			<div className="form-group onetime">
				<span>{this.props.t('Execute time')}</span>
				<input type="text" className="form-control everyIn" placeholder="HH:MM" onChange={this.onTimeChange.bind(this)} />
			</div>
			
		);
	}
}
export default compose(
	withTranslation(),
	connect(state => state.processManagement, Actions)
)(oneTimeOnly);
