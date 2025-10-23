import React from 'react';
import { shallow } from 'enzyme';
import ScalerChart from '../../../views/new-inbox/components/scaler';
import ServerSideDataTable from '../../../common/tables/components/ServerSideDataTable';
import { Provider } from 'react-redux';
import store from '../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../views/new-inbox/NewInboxActions';
import Supervisor from '../../../views/inbox/components/Supervisor';

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Supervisor Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Supervisor.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(Supervisor.prototype.componentDidMount).toHaveBeenCalled();
	Supervisor.prototype.componentDidMount.mockRestore();
});

test('getHistory Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getHistory).toBeDefined();
});

test('getCaseOnClicked Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getCaseOnClicked).toBeDefined();
});

test('getProccessInformation Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getProccessInformation).toBeDefined();
});

test('getTaskInformation Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getTaskInformation).toBeDefined();
});




test('getDataServer Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getDataServer).toBeDefined();
});


test('getTableRow Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Supervisor />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getTableRow).toBeDefined();
});
