import Supervisor from './components/Supervisor';

export const routes = [
	{
		path: '/supervisor',
		exact: true,
		component: Supervisor,
		name: 'Supervisor',
	}
];