import {config} from '../../../config/config'
import getAuthonticatedJSON from "../../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../../common/utils/functions/postAuthenticatedJSON";

export const GET_TABLE_LIST_URL = 'basicinformation/tables-list';
export const GET_TABLE_DATA_URL = 'basicinformation/table-data/';

export function get_table_list(apiServer) {
    return getAuthonticatedJSON(apiServer+GET_TABLE_LIST_URL)
}
export function get_table_data(apiServer,TableName) {
    return getAuthonticatedJSON(apiServer+GET_TABLE_DATA_URL+TableName)
}