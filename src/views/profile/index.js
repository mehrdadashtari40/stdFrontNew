import ViewUserProfile from './containers/ViewUserProfile';
import ChangePassword from "./containers/ChangePassword";

export const routes = [
	{
		path: '/profile',
		exact: true,
		component: ViewUserProfile,
		name: 'ViewUserProfile',
	},
	{
		path: '/change-password',
		exact: true,
		component: ChangePassword,
		name: 'ChangePassword',
	},
];
