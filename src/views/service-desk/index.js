import ServiceDeskFront from './components/ServiceDeskFront';
import MyServiceDeskFront from './components/MyServiceDeskFront';
import ServiceDeskFrontMap from './components/ServiceDeskFrontMap';
import ServiceForm from './components/ServiceForm';

export const routes = [
	{
		path: '/Services',
		exact: true,
		component: ServiceDeskFront,
		name: 'ServiceDeskFront',
	},
	{
		path: '/My',
		exact: true,
		component: MyServiceDeskFront,
		name: 'MyServiceDeskFront',
	},
	{
		path: '/ServicesMap',
		exact: true,
		component: ServiceDeskFrontMap,
		name: 'ServiceDeskFrontMap',
	},
	{
		path: '/Services/:pro_uid/:we_data',
		exact: true,
		component: ServiceForm,
		name: 'ServiceForm',
	},

	{
		path: '/Services/:province',
		exact: true,
		component: ServiceDeskFront,
		name: 'ServiceDeskFront',
	},
];