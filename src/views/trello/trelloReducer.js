import { UPDATE_LANES, REFRESH_LANES ,OPEN_MODAL ,HIDE_MODAL ,
	SET_CURRENT_TASK , GET_FILTER_INFO,CHANGE_VARIABLE ,
	REFRESH_FILTERS
} from './trelloActions';

const initialState = {
	lanes:[
		{
			id:'lane1',
			server_id:0,
			loading:false,
			title:'بک لاگ',
			current_page:0,
			tasks:[]
		},
		{
			id:'lane2',
			server_id:1,
			loading:false,
			title:'در حال انجام',
			current_page:0,
			tasks:[]
		},
		{
			id:'lane3',
			server_id:2,
			loading:false,
			title:'تکمیل شده',
			current_page:0,
			tasks:[]
		}
	],
	update_count:0,
	show_task_modal: true,
	current_task:null,
	current_task_code:null,
	finish_time_text:'',
	description_text:'',
	loading_tasks:[],
	project_types:false,
	projects:false,
	users:false,
	task_title_filter:"",
	filters:null,
	files:[]
};

export function trelloReducer(state = initialState, action) {
	switch (action.type) {
		case UPDATE_LANES:
			return {
				...state,
				lanes: action.payload,
				show_task_modal:false,
				finish_time_text:'',
				description_text:''
			};
		case REFRESH_LANES:
			return {
				...state,
				lanes: action.payload,
				update_count:120,
			};
		case OPEN_MODAL:
			return {
				...state,
				current_task: action.payload,
				show_task_modal:true
			};
		case HIDE_MODAL:
			return {
				...state,
				show_task_modal:false,
				finish_time_text:'',
				description_text:''
			};
		case SET_CURRENT_TASK:
			return {
				...state,
				current_task:action.payload,
				finish_time_text:action.payload.finish_time,
				description_text:action.payload.description
			};
		case CHANGE_VARIABLE: {
				const varName = action.varName;
				let prp = {...state};
				prp[varName] = action.payload;
				return prp;
			}
		case GET_FILTER_INFO: {
				const filter_name = action.filter_name;
				let prp = {...state};
				prp[filter_name] = action.payload;
				return prp;
			}
		case REFRESH_FILTERS: {
			return {
				...state,
				filters:action.payload,
				lanes: action.lanes,
			};	
		}		
		default:
			return state;
	}
}
