import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../../store/configureStore';
import configureStore from 'redux-mock-store';
import Categories from '../../../../views/system-management/components/setting/Categories';
import * as selectActions from '../../../../views/system-management/SystemManagementActions';
import { I18nextProvider } from 'react-i18next';

// const store = mockStore();

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));


test('Make Snapshot file , Categories Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Categories.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(Categories.prototype.componentDidMount).toHaveBeenCalled();
	Categories.prototype.componentDidMount.mockRestore();
});



test('handelIndex Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
				<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelIndex).toBeDefined();
});

test('handelCreate Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
				<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelCreate).toBeDefined();
});

test('handelShow Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
				<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelShow).toBeDefined();
});

test('SetData Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.SetData).toBeDefined();
});

test('disableFields Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.disableFields).toBeDefined();
});

test('enableFields Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Categories />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.enableFields).toBeDefined();
});

describe('actions', () => {
	it('should create an action to loadCategories', () => {
		const data = 'test';
		const expectedAction = {
			type: selectActions.FETCH_CATEGORIES,
			Categories: data,
		};
		expect(selectActions.setCategories(data)).toEqual(expectedAction);
	});

	it('should create an action to loadCategory', () => {
		const data = 'test';
		const expectedAction = {
			type: selectActions.FETCH_CATEGORY,
			Category: data,
		};
		expect(selectActions.setCategory(data)).toEqual(expectedAction);
	});
});
