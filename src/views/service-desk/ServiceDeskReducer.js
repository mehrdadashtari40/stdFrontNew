import { GET_NOTIFICATIONS } from './ServiceDeskActions';
const initialState = {
	notifications: [],
};

export function ServiceDeskReducer(state = initialState, action) {
	switch (action.type) {
		case GET_NOTIFICATIONS:
			return {
				...state,
				notifications: action.notifications,
			};

		default:
			return state;
	}
}
