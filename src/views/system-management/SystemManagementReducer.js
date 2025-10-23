import {
	FETCH_CATEGORIES,
	FETCH_CATEGORY,
	LOAD_USER,
	LOAD_GROUPS,
	LOAD_DEPARTMENTS,
	LOAD_DEPARTMENT,
} from './SystemManagementActions';

const initialState = {
	Categories: [],
	Category: [],
	User: [],
	Users: [],
	Groups: [],
	Departments: [],
	Department: [],
};

export function systemManagementReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_CATEGORIES:
			return {
				...state,
				Categories: action.Categories,
			};

		case FETCH_CATEGORY:
			return {
				...state,
				Category: action.Category,
			};

		case LOAD_USER:
			return {
				...state,
				User: action.User,
			};
		case LOAD_GROUPS:
			return {
				...state,
				Groups: action.Groups,
			};
		case LOAD_DEPARTMENTS:
			return {
				...state,
				Departments: action.Departments,
			};
		case LOAD_DEPARTMENT:
			return {
				...state,
				Department: action.Department,
			};

		default:
			return state;
	}
}
