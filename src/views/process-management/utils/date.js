import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'jalali-moment';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import * as Actions from "../ProcessManagementActions";
class date extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sch_start_date: '',
			sch_end_date: '',
		};
	}
	componentDidMount() {
		let self = this;
		$(function() {
			$('#sch_start_date').persianDatepicker({
				onSelect: function() {
					self.props.onStart(
						moment.from($('#sch_start_date').attr('data-jdate'), 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD')
					);

					self.setState({
						sch_start_date: moment
							.from($('#sch_start_date').attr('data-jdate'), 'fa', 'YYYY/MM/DD')
							.format('YYYY-MM-DD'),
					});
				},
			});
			$('#sch_end_date').persianDatepicker({
				onSelect: function() {
					self.props.onEnd(
						moment.from($('#sch_end_date').attr('data-jdate'), 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD')
					);

					self.setState({
						sch_end_date: moment
							.from($('#sch_end_date').attr('data-jdate'), 'fa', 'YYYY/MM/DD')
							.format('YYYY-MM-DD'),
					});
				},
			});
		});
	}
	onStartChange(e) {
		this.props.onStart(this.state.sch_start_date);
	}
	onEndChange(e) {
		// this.setState({ sch_end_date: e.target.value });
		this.props.onEnd(this.state.sch_end_date);
	}
	onTimeChange(e) {
		this.props.onExecute(e);
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-6">
						<div className="form-group">
							<span>{this.props.t('Start date')}</span>
							<input
								id="sch_start_date"
								name="sch_start_date"
								placeholder="yyyy-mm-dd"
								className="form-control"
								type="text"
								onChange={this.onStartChange.bind(this)}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<span>{this.props.t('End date')}</span>
							<input
								id="sch_end_date"
								name="sch_end_date"
								placeholder="yyyy-mm-dd"
								className="form-control"
								type="text"
								onChange={this.onEndChange.bind(this)}
							/>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col-md-12 col-md-3-push">
						<div className="form-group onetime">
							<span>{this.props.t('Execute time')}</span>
							<input
								type="text"
								className="form-control everyIn"
								placeholder="HH:MM"
								onChange={this.onTimeChange.bind(this)}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default compose(
	withTranslation(),
	connect(state => state.processManagement, Actions)
)(date);
