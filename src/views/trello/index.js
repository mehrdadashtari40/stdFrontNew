import Trello from './components/Trello';

export const routes = [
	{
		path: '/task-board',
		exact: true,
		component: Trello,
		name: 'Trello',
	}
];
export * from './trelloActions';
export * from './trelloReducer';
