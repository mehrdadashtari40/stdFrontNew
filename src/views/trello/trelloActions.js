import getAuthonticatedJSON from "../../common/utils/functions/getAuthenticatedJSON";
import postAuthenticatedJSON from "../../common/utils/functions/postAuthenticatedJSON";
import { config } from "../../config/config";

export const UPDATE_LANES = 'UPDATE_LANES';
export const REFRESH_LANES = 'REFRESH_LANES';
export const OPEN_MODAL = 'OPEN_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SET_CURRENT_TASK = 'SET_CURRENT_TASK';
export const CHANGE_VARIABLE = 'CHANGE_VARIABLE';
export const GET_FILTER_INFO = 'GET_FILTER_INFO';
export const REFRESH_FILTERS = 'REFRESH_FILTERS';

export function get_fitler_info(filter_name){
	const url = config.apiServer + 'arian/board/'+filter_name;
		return dispatch => {
        return getAuthonticatedJSON(url).then(response =>{
			dispatch({
				type: GET_FILTER_INFO,
				payload:response,
				filter_name:filter_name
			});
        })
	};
}

export function change_variable(varName,value){
	return dispatch => {
		dispatch({
			type: CHANGE_VARIABLE,
			payload:value,
			varName:varName
		});
	}
}

export function loading_cards(id,lanes) {
	const new_lanes = lanes.map(x=>{
		if(x.id == id) x.loading = true
		return x;
	});
	return dispatch => {
		dispatch({
			type: UPDATE_LANES,
			payload:new_lanes
		});
	}
}

export function refresh_tasks(filters,lanes) {
	lanes = lanes.map(x=>{
		x.tasks = [];
		x.current_page = 0;
		return x;
	})
	return dispatch => {
		dispatch({
			type: REFRESH_FILTERS,
			payload:filters,
			lanes:lanes
		});
	}
}

export function setLaneInfo(lane_id,lanes,data,current_page=1,refresh = false) {
	const new_lanes = lanes.map(x=>{
		if(x.server_id == lane_id) {
			if(refresh){
				x.tasks = data;
			} else {
				x.tasks = x.tasks.concat(data);
			}
			
			x.loading = false;
			x.current_page = current_page;
		}
		return x;
	});
	return dispatch =>dispatch({
		type: UPDATE_LANES,
		payload:new_lanes
	});
}

export function getTaskInfo(task_code) {
	const url = config.apiServer + 'arian/board/tasks/info';
	let data = {
		"task_code":task_code
	}
	return dispatch => {
        return postAuthenticatedJSON(url,data).then(response =>{
			dispatch({
				type: CHANGE_VARIABLE,
				varName : 'files',
				payload:response.data.files
			});
            dispatch({
				type: SET_CURRENT_TASK,
				payload:response.data
			});
        })
	};
}

export function updateLanes(lanes) {
	return dispatch => dispatch({
		type: UPDATE_LANES,
		payload: lanes
	});
}

export function update_user_info(lanes,task,finish_time_text,description_text) {
	const url = config.apiServer + 'arian/board/tasks/update';
	const data = {
		"task_code":task.task_code,
		"finish_time":finish_time_text,
		"description":description_text
	}
	return dispatch => {
        return postAuthenticatedJSON(url,data).then(response =>{
			let status = parseInt(response.code);
			if(status === 200){
				let modified_lane = lanes.filter(x=>parseInt(x.server_id)===parseInt(task.current_board))[0];
				modified_lane = modified_lane.tasks.map(x=>{
					if(x.TASK_CODE === task.task_code){
						x.finish_time = finish_time_text; 
						x.finish_date = response.data; 
					}
					return x;
				})
				lanes = lanes.map(x=>{
					if(x.server_id === modified_lane.server_id)
						return modified_lane;
					return x;
				})
			} else if(status === 400) {
				alert(response.message);
			}
			dispatch({
				type: UPDATE_LANES,
				payload:lanes
			});
        })
	};
}

export function open_modal(task) {
	return dispatch => {
		dispatch({
			type: OPEN_MODAL,
			payload:task
		});
	}
}
export function close_modal() {
	return dispatch => {
		dispatch({
			type: HIDE_MODAL,
		});
	}
}