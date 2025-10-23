
import React, {Component} from 'react';
import jMoment from 'moment-jalaali';
import { withTranslation } from 'react-i18next';

function TaskInfo(props) {
		let rep = props.taskInfo.DURATION.replace("Hours", "ساعت");
		rep = rep.replace("Minute", "دقیقه");
		rep = rep.replace("Seconds", "ثانیه");

		const regex2 = /([0-9]{4})[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g;
		let initDate = null;
		if(regex2.exec(props.taskInfo.INIT_DATE)) {
			// true regex date format
			initDate = jMoment(props.taskInfo.INIT_DATE).format('HH:mm:ss jYYYY/jMM/jDD');
		} else {
			// false regex
			initDate = props.t('Case Not Started');
		}


		return (
			<div>
				<table
					className="table table-bordered">
					<tbody>
					<tr>
						<td> {props.t('Title')}</td>
						<td> {props.taskInfo.TAS_TITLE ? props.taskInfo.TAS_TITLE : props.t('Not Value')} </td>
					</tr>
					<tr>
						<td> {props.t('Description')}</td>
						<td>{props.taskInfo.TAS_DESCRIPTION ? props.taskInfo.TAS_DESCRIPTION : props.t('Not Value')}</td>
					</tr>
					<tr>
						<td>{props.t('Init Date')}</td>
						<td>{initDate}</td>
						{/*<td>{jMoment(props.taskInfo.INIT_DATE).format('HH:mm:ss jYYYY/jMM/jDD')}</td>*/}
					</tr>
					<tr>
						<td> {props.t('Due Date')}</td>
						<td>{jMoment(props.taskInfo.DUE_DATE).format('HH:mm:ss jYYYY/jMM/jDD')}</td>
					</tr>
					<tr>
						<td> {props.t('Finish Date')}</td>
						<td>{props.taskInfo.FINISH == "Not finished" ? props.t('Not finished') : jMoment(props.taskInfo.FINISH).format('HH:mm:ss jYYYY/jMM/jDD')}</td>
					</tr>
					<tr>
						<td> {props.t('Task Duration')}</td>
						<td> {props.taskInfo.DURATION == "Not finished" ? props.t('Not finished') : rep }</td>
					</tr>
					</tbody>
				</table>
			</div>
		);
}

export default withTranslation()(TaskInfo);