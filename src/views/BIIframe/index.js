import BI from "./BI";
export const routes = [
	{
		path: '/Connection',
		exact: true,
		component: BI,
		name: 'Connection',
	},
	{
		path: '/UserParameters',
		exact: true,
		component: BI,
		name: 'UserParameters',
	},
	{
		path: '/DashboardBi',
		exact: true,
		component: BI,
		name: 'DashboardBi',
	},
	{
		path: '/DashboardBi/show/:id',
		exact: true,
		component: BI,
		name: 'DashboardBiShow',
	},
	{
		path: '/ViewDashboard',
		component: BI,
		name: 'ViewDashboard',
		// getComponent(nextState, cb) {
		// 	System.import('./BI').then(m => {
		// 		cb(null, m.default);
		// 	});
		// },
	},
	
];




// export default {
// 	component: require('../../components/common/Layout').default,

// 	childRoutes: [
// 		{
// 			path: 'Connection',
// 			getComponent(nextState, cb) {
// 				System.import('./BI').then(m => {
// 					cb(null, m.default);
// 				});
// 			},
// 		},
// 		{
// 			path: 'UserParameters',
// 			getComponent(nextState, cb) {
// 				System.import('./BI').then(m => {
// 					cb(null, m.default);
// 				});
// 			},
// 		},
// 		{
// 			path: 'DashboardBi',
// 			getComponent(nextState, cb) {
// 				System.import('./BI').then(m => {
// 					cb(null, m.default);
// 				});
// 			},
// 		},
// 		{
// 			path: 'DashboardBi/show/:id',
// 			getComponent(nextState, cb) {
// 				System.import('./BI').then(m => {
// 					cb(null, m.default);
// 				});
// 			},
// 		},
// 	],
// };
