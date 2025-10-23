import Axios from "axios";
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";
import { config } from "../../../config/config";

const SSO_URL = 'std/auth/my-iran-sso';


export function login_sso(data) {
    return Axios.post(config.apiServer + SSO_URL, data);
}

