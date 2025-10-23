import getAuthonticatedJSON from '../../common/utils/functions/getAuthenticatedJSON';
import postAuthenticatedJSON from '../../common/utils/functions/postAuthenticatedJSON';
import { config } from '../../config/config';

export const INSERT_NEW = 'INSERT_NEW';
export const GET_PROCESS_LIST = 'GET_PROCESS_LIST';
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const DEACTIVE_PROCESS = 'GET_CATEGORIES';
export const DELETE_PROCESS = 'DELETE_PROCESS';
export const DELETE_CASES = 'DELETE_CASES';

export function insertNew(url, request) {
	return dispatch => {
		return postAuthenticatedJSON(url, request).then(response => {
			dispatch(setInsertNewData(response));
		});
	};
}

export function setInsertNewData(data) {
	return {
		type: INSERT_NEW,
		data: data,
	};
}

export function getProcessList(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setProcessList(response.processes));
		});
	};
}

export function setProcessList(data) {
	return {
		type: GET_PROCESS_LIST,
		data: data,
	};
}

export function getCategories(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setCategories(response));
		});
	};
}

export function setCategories(data) {
	return {
		type: GET_CATEGORIES,
		categories: data,
	};
}

export function deactivateProcessCases(url, data,process) {
	return dispatch => {
		return postAuthenticatedJSON(url, data).then(response => {
			return {
				type: DELETE_CASES,
				data: data,
				payload: process,
			};
		});
	};
}

export function deactivateProcess(url, data) {
	return dispatch => {
		return postAuthenticatedJSON(url, data).then(response => {
			if (response === 1) dispatch(setDeactivateProcess(response));
		});
	};
}

export function setDeactivateProcess(data) {
	return {
		type: DEACTIVE_PROCESS,
		data: data,
	};
}

export function deleteProcess(url, data) {
	return dispatch => {
		return postAuthenticatedJSON(url, data).then(response => {
			dispatch(setDeleteProcess(response));
		});
	};
}

export function setDeleteProcess(data) {
	return {
		type: DELETE_PROCESS,
		data: data,
	};
}
