

import getAuthonticatedJSON from '../../common/utils/functions/getAuthenticatedJSON';
import postAuthenticatedJSON from '../../common/utils/functions/postAuthenticatedJSON';
import putRequest from '../../common/utils/functions/putRequest';
import { config } from '../../config/config';
import deleteAuthonticatedJSON from "../../common/utils/functions/deleteAuthonticatedJSON";


export const FETCH_ITEMS = 'FETCH_ITEMS';
export const ADD_ITEM = 'ADD_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const LOADING_STATUS = 'LOADING_STATUS';
export const GET_Table_DATA = 'GET_Table_DATA';
export const SET_PRIMARY_KEY = 'SET_PRIMARY_KEY';
export const SET_EMPTY_EDIT_ITEM = 'SET_EMPTY_EDIT_ITEM';

export const fetchTableList = () => {
	return dispatch => {
		const url = 'basicinformation/tables-list';
		return getAuthonticatedJSON(config.apiServer + url).then(res => {
			dispatch(setTableList(res));
		});
	};
};

const setTableList = tablesList => {
	return {
		type: FETCH_ITEMS,
		tablesList,
	};
};

// TODO : Get tables Data
export const getTableData = tableName => {
	return dispatch => {
		dispatch(changeLoadingStatus(true));
		const url = 'basicinformation/table-data/' + tableName;
		return getAuthonticatedJSON(config.apiServer + url).then(response => {
			dispatch(changeLoadingStatus(false));
			dispatch(setTableData(response, tableName));
		});
	};
};

export const setTableData = (tablesData, selectedTable) => {
	return {
		type: GET_Table_DATA,
		structure: tablesData['structure'],
		data: tablesData['data'],
		selectedTable: selectedTable,
	};
};
// TODO : change status
const changeLoadingStatus = loading => {
	return {
		type: LOADING_STATUS,
		loading,
	};
};

// TODO : Add new item
export const addNewItem = (newItemData, callback) => {
	return dispatch => {
		return postAuthenticatedJSON(config.apiServer + 'basicinformation/table-data', newItemData).then(response => {
			dispatch(setNewItem(response)); // TODO : new Item dont dispatch reducers
			callback();
		});
	};
};

const setNewItem = data => {
	return {
		type: ADD_ITEM,
		data,
	};
};

// TODO : Remove item
export const deleteItem = (id, tableName, primaryKey) => {
	return dispatch => {
		let url = 'basicinformation/table-data/' + id + '/' + tableName;
		let data = {};
		data.TABLE_NAME = tableName;
		return deleteAuthonticatedJSON(config.apiServer + url, data).then(() => {
			dispatch(removeItem(id, primaryKey));
			// callback();
		});
	};
};

const removeItem = (id, primaryKey) => {
	return {
		type: DELETE_ITEM,
		id,
		primaryKey,
	};
};

// TODO : update item
export const updateItem = (recordId, sendData, fieldKey, callback) => {
	return dispatch => {
		const url = 'basicinformation/table-data/' + recordId;
		return putRequest(config.apiServer + url, sendData).then(() => {
			const data = Object.fromEntries(Object.entries(sendData).filter(([key, value]) => key !== 'table_name'));
			data.ID = recordId;
			dispatch(setUpdate(recordId, data, fieldKey));
			callback();
		});
	};
};

const setUpdate = (id, data, primaryKey) => {
	return {
		type: UPDATE_ITEM,
		id,
		data,
		primaryKey,
	};
};

// TODO : Edit item
export const editItem = (id, primaryKey) => {
	return dispatch => {
		dispatch(setEditItem(id, primaryKey));
	};
};

const setEditItem = (id, primaryKey) => {
	return {
		type: EDIT_ITEM,
		id,
		primaryKey,
	};
};

// TODO : Set primary key function
export const setPrimaryKey = primaryKey => {
	return dispatch => {
		dispatch({ type: SET_PRIMARY_KEY, primaryKey });
	};
};

// TODO : Set null to edit item
export const setEmptyEditItem = () => {
	return dispatch => {
		dispatch({
			type: SET_EMPTY_EDIT_ITEM,
		});
	};
};
