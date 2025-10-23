import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../views/new-inbox/NewInboxActions';
import Base from '../../../views/basic-information/containers/Base';
import $ from 'jquery'
jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Basic Information Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});


it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Base.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(Base.prototype.componentDidMount).toHaveBeenCalled();
	Base.prototype.componentDidMount.mockRestore();
});

test('getTablesData Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getTablesData).toBeDefined();
});
test('onTableSelect Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.onTableSelect).toBeDefined();
});
test('deleteRowItem Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.deleteRowItem).toBeDefined();
});
test('addNewItem Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.addNewItem).toBeDefined();
});
test('setEmptyValues Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.setEmptyValues).toBeDefined();
});


test('onNewItem Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.onNewItem).toBeDefined();
});


test('editRowItem Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.editRowItem).toBeDefined();
});

test('updateItem Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.updateItem).toBeDefined();
});


test('getPrimaryKey Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getPrimaryKey).toBeDefined();
});


test('addNewItem Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.addNewItem).toBeDefined();
});

test('onNewItem Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.onNewItem).toBeDefined();
});



it('onTableSelect  work Corectly ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Base />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();

	const spy = jest.spyOn(instance, 'onTableSelect');

	instance.forceUpdate();

	const select = wrapper.find('#selected');
	select.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalledWith({ target: { value: 'test' } });
});