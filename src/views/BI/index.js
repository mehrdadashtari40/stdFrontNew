import BIPermissions from "./containers/BIPermissions";
import BIRoles from "./containers/BIRoles";

export const routes = [
	{
		path: '/setting/bi-permissions',
		exact: true,
		component: BIPermissions,
		name: 'BIPermissions',
	},
	{
		path: '/setting/bi-roles',
		exact: true,
		component: BIRoles,
		name: 'BIRoles',
	},
	
	
];

export * from './BIActions';
export * from './BIReducer';


