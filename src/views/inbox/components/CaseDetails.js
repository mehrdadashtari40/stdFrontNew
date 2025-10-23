import React from 'react'
import {connect} from 'react-redux'
import {config} from '../../../config/config'
function CaseDetails(props) {
    const id = props.match.params.id;
    const delId = props.match.params.del_index;
    const url = config.iframeServer + "cases/open?APP_UID=" + id + "&DEL_INDEX=" + delId + "&sid=" + localStorage.getItem('session_id');
    return (
        <div style={{height: "100%"}}>
            <iframe
                sandbox="allow-downloads allow-top-navigation allow-same-origin allow-scripts
                  allow-forms allow-modals allow-popups allow-top-navigation allow-pointer-lock "
                style={{width: "100%", height: "100vh", minHeight: "200px", border: "0"}}
                src={url}
            ></iframe>
        </div>)
}
export default connect((state) => (state.newInbox))(CaseDetails)