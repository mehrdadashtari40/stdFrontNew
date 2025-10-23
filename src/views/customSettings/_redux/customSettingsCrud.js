
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";
import axios, { post } from 'axios';

export const POST_CUSTOM_SETTINGS_URL= 'arian/ut/custom-settings/';

export function post_custom_settings(apiServer,data) {
    let myToken = localStorage.getItem('access_token');
    const config ={
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer '+myToken
        }
    }
    return  post(apiServer+POST_CUSTOM_SETTINGS_URL, data ,config)
}

