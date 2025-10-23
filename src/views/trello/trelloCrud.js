import getAuthonticatedJSON from "../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../common/utils/functions/postAuthenticatedJSON";
import { config } from "../../config/config";
import {post} from "axios";
import {POST_CUSTOM_SETTINGS_URL} from "../customSettings/_redux/customSettingsCrud";


export function get_lane_info(apiServer,lane_id, current_page = 1, filters = null,task_title=null) {
    let params = [];
    params.push('board_id=' + lane_id);
    params.push('Page=' + current_page);
    if(task_title !== null && task_title!==""){
        params.push("title=" + task_title)
    }
    if (filters !== null) {
        if (filters.project_types.length > 0) {
            params.push("project_types=" + filters.project_types.join(','))
        }
        if (filters.projects.length > 0) {
            params.push("projects=" + filters.projects.join(','))
        }
        if (filters.users.length > 0) {
            params.push("users=" + filters.users.join(','))
        }
    }

    const url = apiServer + "arian/board/tasks" + '?' + params.join('&');

    return getAuthonticatedJSON(url);
}

export function change_task_lane(apiServer,target_lane, task_id) {
    const data = {
        "task_code": task_id,
        "board_id": target_lane.server_id
    }
    return postAuthenticatedJSON(apiServer + "arian/board/tasks/assign", data);
}

export function postCheckListAndComments(apiServer,task_code, type, info){
    const data = {
        task_code,
        type,
        content:info
    }
    const dataJson = JSON.stringify(data);
    return postAuthenticatedJSON(apiServer + "arian/board/tasks/checklist", data);
}

export function postFiles(apiServer,files) {
    let myToken = localStorage.getItem('access_token');
    const config ={
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer '+myToken
        }
    }
    return  post(apiServer+"arian/board/tasks/upload_files", files ,config)
}

export function updateFiles(apiServer,files) {
    return postAuthenticatedJSON(apiServer + "arian/board/tasks/update_files", files);
    // let myToken = localStorage.getItem('access_token');
    // const config ={
    //     headers: {
    //         'content-type': 'multipart/form-data',
    //         'Authorization': 'Bearer '+myToken
    //     }
    // }
    // return  post(apiServer+"arian/board/tasks/update_files", files ,config)
}