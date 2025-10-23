import Design from './components/Design';
export const routes = [
	{
		path: "/process-management",
		exact: true,
		component: Design,
		name: 'Design',
	},
];
export * from './ProcessManagementActions';
export * from './ProcessManagementReducer';
