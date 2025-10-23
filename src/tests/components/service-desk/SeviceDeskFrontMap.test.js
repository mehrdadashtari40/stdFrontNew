import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../views/service-desk/ServiceDeskActions';
import $ from 'jquery';
import ServiceDeskFrontMap from '../../../views/service-desk/components/ServiceDeskFrontMap';

const mockData = {
	params: {
		province: ['zanjan', 'tehran'],
	},
};
jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , ServiceDeskFrontMapComponent', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(ServiceDeskFrontMap.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(ServiceDeskFrontMap.prototype.componentDidMount).toHaveBeenCalled();
	ServiceDeskFrontMap.prototype.componentDidMount.mockRestore();
});


it('searchChanged HaveBeenCalled when searchBar change?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'searchChanged');

	instance.forceUpdate();

	const input = wrapper.find('#searchBar').at(0);
	input.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalled();
});


test('itemCredentional Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.itemCredentional).toBeDefined();
});

test('ToggleFilter Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.ToggleFilter).toBeDefined();
});

test('searchChanged Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.searchChanged).toBeDefined();
});

test('ratingChanged Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.ratingChanged).toBeDefined();
});


test('RateMessageChanged Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.RateMessageChanged).toBeDefined();
});


test('RateServiceChanged Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.RateServiceChanged).toBeDefined();
});

test('handleRatingSubmit Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handleRatingSubmit).toBeDefined();
});

test('itemTracker Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<ServiceDeskFrontMap match={mockData} />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.itemTracker).toBeDefined();
});

