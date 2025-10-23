import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

import { userReducer, requestUserInfo } from '../common/user';
import { i18nReducer, i18nInit } from '../common/i18n';
import { trelloReducer } from '../views/trello';
import { systemManagementReducer } from '../views/system-management';
import { ProcessManagementReducer } from '../views/process-management';

import {reducer as layout2Reducer} from '../common/layout/_redux/layoutRedux'
import {reducer as tableReducer} from '../../src/common/tables/_redux/tableRedux'


import {reducer as basicInformationReducer} from '../views/basic-information/_redux/baseInfoRedux';
import LogsReducer from '../views/logs/LogReducesrs';

import BIReducer from '../views/BI/BIReducer';
import {reducer as inboxReducer} from "../views/inbox/_redux/inboxRedux";
import {reducer as authReducer} from '../../src/views/auth/_redux/authRedux'

import {reducer as ServiceDeskReducer} from "../views/service-desk/_redux/serviceDeskRedux";
import {reducer as SupervisorReducer} from "../views/supervisor/_redux/supervisorRedux";
import {reducer as CustomSettingsReducer} from "../views/customSettings/_redux/customSettingsRedux";
import {reducer as MenuReducer} from "../views/menu/_redux/menuRedux";
import {reducer as WorkDeskReducer} from "../views/work-desk/_redux/workDeskRedux";

export const rootReducer = combineReducers({
	auth: authReducer,
	user: userReducer,
	i18n: i18nReducer,
	basicInformation: basicInformationReducer,
	processManagement: ProcessManagementReducer,
	systemManagement: systemManagementReducer,
	ServiceDesk:ServiceDeskReducer,
	BI:BIReducer,
	trello:trelloReducer,
	inbox:inboxReducer,
	layout2:layout2Reducer,
	table:tableReducer,
	logs:LogsReducer,
	supervisor:SupervisorReducer,
	customSettingsReducer:CustomSettingsReducer,
	menuReducer:MenuReducer,
	workDeskReducer:WorkDeskReducer
});

const store = createStore(
	rootReducer,
	applyMiddleware(thunk)
);

store.dispatch(requestUserInfo());

store.dispatch(i18nInit());

export default store;
