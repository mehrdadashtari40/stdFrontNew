import getAuthonticatedJSON from '../../common/utils/functions/getAuthenticatedJSON';

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const FETCH_CATEGORY = 'FETCH_CATEGORY';
export const LOAD_USER = 'LOAD_USER';
export const LOAD_GROUPS = 'LOAD_GROUPS';
export const LOAD_DEPARTMENTS = 'LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENT = 'LOAD_DEPARTMENT';



export function loadCategories(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setCategories(response));
		});
	};
}

export function setCategories(data) {
	return {
		type: FETCH_CATEGORIES,
		Categories: data,
	};
}

export function loadCategory(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setCategory(response));
		});
	};
}

export function setCategory(data) {
	return {
		type: FETCH_CATEGORY,
		Category: data,
	};
}

export function loadUser(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setUser(response));
		});
	};
}

export function setUser(data) {
	return {
		type: LOAD_USER,
		User: data,
	};
}

export function loadGroups(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setGroups(response));
		});
	};
}

export function setGroups(data) {
	return {
		type: LOAD_GROUPS,
		Groups: data,
	};
}

export function loadDepartments(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setDepartments(response));
		});
	};
}

export function setDepartments(data) {
	return {
		type: LOAD_DEPARTMENTS,
		Departments: data,
	};
}


export function loadDepartment(url) {
	return dispatch => {
		return getAuthonticatedJSON(url).then(response => {
			dispatch(setDepartment(response));
		});
	};
}

export function setDepartment(data) {
	return {
		type: LOAD_DEPARTMENT,
		Department: data,
	};
}


