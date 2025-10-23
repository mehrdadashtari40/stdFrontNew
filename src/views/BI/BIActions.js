
import getAuthonticatedJSON from '../../common/utils/functions/getAuthenticatedJSON';

export const FETCH_ALL_ROLES = "FETCH_ALL_ROLES"
export const FETCH_ROLE = "FETCH_ROLE"
export const DELETE_ROLE = "DELETE_ROLE"
export const UPDATE_ROLE = "UPDATE_ROLE"
export const FETCH_ALL_PERMISSIONS = "FETCH_ALL_PERMISSIONS"
export const FETCH_PERMISSION = "FETCH_PERMISSION"
export const DELETE_PERMISSION = "DELETE_PERMISSION"
export const UPDATE_PERMISSION = "UPDATE_PERMISSION"
export const CLEAR_ROLES = "CLEAR_ROLES"
export const CLEAR_PERMISSIONS = "CLEAR_PERMISSIONS"








export const clearRoles = () =>{
		return {
				type:CLEAR_ROLES
		}
}
export const clearPermissions = () =>{
	return {
			type:CLEAR_PERMISSIONS
	}
}




export const fetchAllRoles = (url) => {
	return dispatch => {
		return getAuthonticatedJSON(url).then(res => {
			dispatch(SetAllRoles(res));
		});
	}
}

const SetAllRoles = (roles) => {
	return {
		type: FETCH_ALL_ROLES,
		roles
	}
}

export const fetchRole = (url) => {
	return dispatch => {
		return getAuthonticatedJSON(url).then(res => {
			dispatch(SetRole(res));
		});
	}
}

const SetRole = (role) => {
	return {
		type: FETCH_ROLE,
		role
	}
}

export function updateRole(id ,data) {
	return {
		type: UPDATE_ROLE,
		id: id,
		role: data
	};
}


export const fetchAllPermissions = (url) => {
	return dispatch => {
		return getAuthonticatedJSON(url).then(res => {
			dispatch(SetAllPermissions(res));
		});
	}
}

const SetAllPermissions = (permissions) => {
	return {
		type: FETCH_ALL_PERMISSIONS,
		permissions
	}
}

export const fetchPermission = (url) => {
	return dispatch => {
		return getAuthonticatedJSON(url).then(res => {

			dispatch(SetPermission(res));
		});
	}
}

const SetPermission = (permission) => {
	return {
		type: FETCH_PERMISSION,
		permission
	}
}

export function updatePermission(id ,data) {
	return {
		type: UPDATE_PERMISSION,
		id: id,
		permission: data
	};
}



