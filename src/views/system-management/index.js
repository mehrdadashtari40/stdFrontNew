import Categories from './components/setting/Categories';
import PmTables from './components/setting/PmTables';
import Backup from './components/backup/Backup';
import Setting from './components/setting/Setting';
import Users from './components/users/Users';
import Groups from './components/users/Groups';
import Department from './components/users/Departments';
export const routes = [
	{
		path: '/process-categories',
		exact: true,
		component: Categories,
		name: 'Categories',
	},
	{
		path: '/pm-tables',
		exact: true,
		component: PmTables,
		name: 'PmTables',
	},
	{
		path: '/backup',
		exact: true,
		component: Backup,
		name: 'Backup',
	},
	{
		path: '/setting',
		exact: true,
		component: Setting,
		name: 'Setting',
	},
	{
		path: '/users',
		exact: true,
		component: Users,
		name: 'Users',
	},
	{
		path: '/groups',
		exact: true,
		component: Groups,
		name: 'Groups',
  },
  
  {
		path: '/departments',
		exact: true,
		component: Department,
		name: 'Department',
	},
];
export * from './SystemManagementActions';
export * from './SystemManagementReducer';
