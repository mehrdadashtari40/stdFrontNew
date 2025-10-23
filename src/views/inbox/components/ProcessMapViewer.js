import React from 'react'
import {connect} from 'react-redux'
import {config} from '../../../config/config'

function ProcessMapViewer(props) {
    const proUid = props.match.params.proUid;
    const appUid = props.match.params.appUid;
    const url = config.iframeServer + "designer?prj_uid=" + proUid + '&prj_readonly=true&app_uid=' + appUid + "&sid=" + localStorage.getItem('session_id');
    return (<div className="no-padding">
        <div style={{height: "100%"}}>
            <iframe
                sandbox="allow-downloads allow-top-navigation allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-top-navigation allow-pointer-lock"
                style={{width: "100%", height: "100vh", minHeight: "200px", border: "0"}}
                src={url}></iframe>
        </div>
    </div>);
}

export default connect((state) => (state.newInbox))(ProcessMapViewer)
