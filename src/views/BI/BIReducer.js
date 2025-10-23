import {
	FETCH_ALL_ROLES,
	FETCH_ROLE,
	UPDATE_ROLE,
	FETCH_ALL_PERMISSIONS,
	FETCH_PERMISSION,
	UPDATE_PERMISSION,
	CLEAR_PERMISSIONS,
	CLEAR_ROLES
} from './BIActions'

const initialState = {
	Roles:[],
	Role:[],
	Permissions:[],
	Permission:[]
}

const BIReducer = (state = initialState , action) => {
	switch (action.type) {
		case FETCH_ALL_ROLES:
			return {
				...state,
				Roles: action.roles,
			};
			case FETCH_ROLE:
			return {
				...state,
				Role: action.role,
			};
			case UPDATE_ROLE:
			return {
				...state,
				Roles: state.Roles.map(role => (role.id == action.id ? action.role : role)),
			};
			case FETCH_ALL_PERMISSIONS:
			return {
				...state,
				Permissions: action.permissions,
			};
			case FETCH_PERMISSION:
			return {
				...state,
				Role: action.permission,
			};
			case UPDATE_PERMISSION:
			return {
				...state,
				Permissions: state.Permissions.map(permission => (permission.id == action.id ? action.permission : permission)),
			};
			case CLEAR_PERMISSIONS:
				return {
					Permission : []
				}
				case CLEAR_ROLES:
				return {
					Roles : []
				}
			default:
				return state;
	}
}

export default BIReducer;