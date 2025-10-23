import Log from "./containers/Log";
import AllUsersSuccessfulLogin from "./containers/AllUsersSuccessfulLogin";
import AllUsersFailedLogin from "./containers/AllUsersFailedLogin";
import SuccessfulLogin from "./containers/SuccessfulLogin";
import FailedLogin from "./containers/FailedLogin";

export const routes = [
	{
		path: '/logs/:type',
		exact: true,
		component: Log,
		name: 'Log',
	},
	// {
	// 	path: '/logs/users-successful-login',
	// 	exact: true,
	// 	component: AllUsersSuccessfulLogin,
	// 	name: 'AllUsersSuccessfulLogin',
	// },
	// {
	// 	path: '/logs/users-failed-login',
	// 	exact: true,
	// 	component: AllUsersFailedLogin,
	// 	name: 'AllUsersFailedLogin',
	// },
	// {
	// 	path: '/logs/successful-login',
	// 	exact: true,
	// 	component: SuccessfulLogin,
	// 	name: 'SuccessfulLogin',
	// },
	// {
	// 	path: '/logs/failed-login',
	// 	exact: true,
	// 	component: FailedLogin,
	// 	name: 'FailedLogin',
	// },
];