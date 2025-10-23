import Inbox from './components/Inbox';
import CaseDetails from "./components/CaseDetails";
import CaseCreate from "./components/CaseCreate";
import ProcessMapViewer from "./components/ProcessMapViewer";
import Supervisor from "../supervisor/components/Supervisor";

export const routes = [
	{
		path: '/inbox',
		exact: true,
		component: Inbox,
		name: 'Inbox',
	},
	{
		path: '/details/:id/:del_index',
		exact: true,
		component: CaseDetails,
		name: 'CaseDetails',
	},
	{
		path: '/new-case/:pro_uid/:tas_uid',
		exact: true,
		component: CaseCreate,
		name: 'CaseCreate',
	},
	{
		path: '/process-map/:appUid/:proUid',
		exact: true,
		component: ProcessMapViewer,
		name: 'ProcessMapViewer',
	},
	{
		path: '/supervisor',
		exact: true,
		component: Supervisor,
		name: 'Supervisor',
	},
];