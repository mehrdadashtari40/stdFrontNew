import {
	UPDATE_ITEM,
	FETCH_ITEMS,
	EDIT_ITEM,
	ADD_ITEM,
	LOADING_STATUS,
	GET_Table_DATA,
	DELETE_ITEM,
	SET_PRIMARY_KEY,
	SET_EMPTY_EDIT_ITEM,
} from './basicInformationActions';

const STATE_INIT = {
	tablesList: [],
	structure: [],
	data: [],
	loading: false,
	selectedTable: '',
	primaryKey: '',
	editRowItem: {},
};

const basicInformationReducer = (state = STATE_INIT, action) => {
	switch (action.type) {
		case FETCH_ITEMS:
			return { ...state, tablesList: action.tablesList };

		case LOADING_STATUS:
			return { ...state, loading: action.loading };

		case SET_PRIMARY_KEY:
			return { ...state, primaryKey: action.primaryKey };

		case GET_Table_DATA:
			let primaryKey = '';
			action.structure.filter(item => {
				if (item.ai == 'yes') {
					primaryKey = item.name;
				}
			});
			return {
				...state,
				structure: action.structure,
				data: action.data,
				selectedTable: action.selectedTable,
				primaryKey: primaryKey,
			};

		case ADD_ITEM:
			return { ...state, data: state.data.concat(action.data) };

		case DELETE_ITEM:
			return {
				...state,
				data: state.data.filter(item => {
					return item[action.primaryKey] != action.id;
				}),
			};

		case EDIT_ITEM:
			const itemForEdit = state.data.filter(item => {
				if (item[action.primaryKey] == action.id) return { ...item };
			});
			return { ...state, editRowItem: itemForEdit[0] };

		case SET_EMPTY_EDIT_ITEM:
			return { ...state, editRowItem: {} };

		case UPDATE_ITEM:
			return {
				...state,
				data: state.data.map(item => {
					if (item[action.primaryKey] == action.id) {
						item = action.data;
						return item;
					}
					return item;
				}),
			};

		default:
			return state;
	}
};

export default basicInformationReducer;
