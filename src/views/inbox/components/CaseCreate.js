import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { config } from '../../../config/config';
import postAuthenticatedJSON from '../../../common/utils/functions/postAuthenticatedJSON';

function CaseCreate(props) {
		const pro_uid = props.match.params.pro_uid;
		const tas_uid = props.match.params.tas_uid;
		const NewCaseData = {
			pro_uid: pro_uid,
			tas_uid: tas_uid,
		};
		let URL = config.apiServer + 'cases';

	useEffect(() => {
		postAuthenticatedJSON(URL, NewCaseData).then(res => {
			window.location.replace(
				'#/details/' + res.app_uid + '/1' + '&sid=' + localStorage.getItem('session_id')
			);
		}).catch(err => {
			console.log('errrr',err)
		});
	},{});
	return <></>;
}

export default connect(state => state.newInbox)(CaseCreate);
