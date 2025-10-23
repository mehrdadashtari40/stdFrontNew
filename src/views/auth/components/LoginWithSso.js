import React, {Component} from 'react';
import {config, get_my_conf, refresh} from '../../../config/config';
import getPmSession from "../../../common/utils/functions/getPmSession";
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import * as layout from "../../../common/layout/_redux/layoutRedux";
import {verify_sso} from "../_redux/authCrud";
import getAuthenticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";


function loginWithSso(props) {

    let token = props.match.params.token;
        verify_sso(token).done(function (data) {
            if (data.status === 200) {
                localStorage.setItem('access_token', data.access_token);
                getPmSession();
                props.handle_reset_store();
                window.location.replace('#/inbox');
            } else {
                // localStorage.setItem('baseURL', null);
                //window.location.replace("#/login");
            }
        })

 


    return (
        <>asdasdasd</>
    )
}

export default compose(
    withTranslation(),
    connect(null, layout.actions)
)(loginWithSso);