import {
	INSERT_NEW,
	GET_PROCESS_LIST,
	GET_CATEGORIES,
	DEACTIVE_PROCESS,
	DELETE_PROCESS, DELETE_CASES,
} from './ProcessManagementActions';

const initialState = {
	data: [],
	categories: [],
};

export function ProcessManagementReducer(state = initialState, action) {
	switch (action.type) {
		case INSERT_NEW:
			return {
				...state,
				data: action.data,
			};

		case GET_PROCESS_LIST:
			return {
				...state,
				data: action.data,
			};
		case GET_CATEGORIES:
			return {
				...state,
				categories: action.categories,
			};
		case DEACTIVE_PROCESS:
			return {
				...state,
				data: action.data,
			};
		case DELETE_PROCESS:
			return {
				...state,
				data: action.data,
			};
		case DELETE_CASES:
			return {
				...state,
				data: action.payload,
			};
		default:
			return state;
	}
}
