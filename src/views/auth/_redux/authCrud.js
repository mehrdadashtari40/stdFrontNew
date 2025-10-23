import {config} from '../../../config/config'
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";
import $ from "jquery";

export const GET_USER_SETTING_URL = config.apiServer + 'anrsetting/default_route';
export const POST_SSO_TOKEN_VERIFY_URL = config.apiServer + 'tavanirlogin/verify-token';
export const GET_VERIFICATION_CODE_URL = 'arian/forget-password/';
export const POST_VERIFICATION_CODE_URL = 'arian/validate-code/';

export function get_user_info(apiServer) {
    return getAuthonticatedJSON(apiServer + 'anrsetting/default_route/')
}

export function verify_sso(token) {
    return $.ajax({
        type: "POST",
        url: POST_SSO_TOKEN_VERIFY_URL,
        data: {token: token},
        dataType: 'json',
    })
}

export function get_verification_code(apiServer,username) {
    return $.ajax({
        type: "POST",
        url: apiServer+GET_VERIFICATION_CODE_URL,
        data: {username: username},
    })
}
export function post_verification_code(apiServer,data) {
    return $.ajax({
        type: "POST",
        url: apiServer+POST_VERIFICATION_CODE_URL,
        data: data,
    })
}
