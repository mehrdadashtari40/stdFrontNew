import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../../views/system-management/SystemManagementActions';
import Departments from '../../../../views/system-management/components/users/Departments';
jest.dontMock('jquery');

const mockDepData = {
	dep_uid: '4887920315e248300ebfe31058662612',
	dep_parent: '',
	dep_title: 'A221rian',
	dep_status: 'ACTIVE',
	dep_manager: '',
	dep_manager: '6554024065d0d30a4395db8009405781',
	dep_manager_firstname: 'افشین',
	dep_manager_lastname: 'اسدنژاد',
	dep_manager_username: '2949498868',
	dep_members: 5,
	dep_parent: '',
	dep_status: 'ACTIVE',
	dep_title: 'A111rian',
	dep_uid: '5166284725e2481aba1ba99030294970',
	expanded: false,
	has_children: '1',
};

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Departments Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Departments.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(Departments.prototype.componentDidMount).toHaveBeenCalled();
	Departments.prototype.componentDidMount.mockRestore();
});

// it('newHandelCreate HaveBeenCalled ?', () => {
// 	const wrapper = shallow(
// 		<Provider store={store}>
// 			<Departments />
// 		</Provider>
// 	)
// 		.dive({ context: { store } })
// 		.dive();
// 	const instance = wrapper.instance();
// 	const spy = jest.spyOn(instance, 'newHandelCreate');

// 	instance.forceUpdate();

// 	const Button = wrapper.find('.btn-outline-success');
// 	Button.simulate('click');
// 	expect(spy).toHaveBeenCalled();
// });

// it('setDepartmentManager HaveBeenCalled ?', () => {
// 	const wrapper = shallow(
// 		<Provider store={store}>
// 			<Departments />
// 		</Provider>
// 	)
// 		.dive({ context: { store } })
// 		.dive();
// 	const instance = wrapper.instance();
// 	const spy = jest.spyOn(instance, 'setDepartmentManager');

// 	instance.forceUpdate();

// 	const Button = wrapper.find('#set');
// 	Button.simulate('click');
// 	expect(spy).toHaveBeenCalled();
// });

// it('unSetDepartmentManager HaveBeenCalled ?', () => {
// 	const wrapper = shallow(
// 		<Provider store={store}>
// 			<Departments />
// 		</Provider>
// 	)
// 		.dive({ context: { store } })
// 		.dive();
// 	const instance = wrapper.instance();
// 	const spy = jest.spyOn(instance, 'unSetDepartmentManager');

// 	instance.forceUpdate();

// 	const Button = wrapper.find('#unset');
// 	Button.simulate('click');
// 	expect(spy).toHaveBeenCalled();
// });

test('handelIndex Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
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
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelCreate).toBeDefined();
});

test('newHandelCreate Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.newHandelCreate).toBeDefined();
});
test('buildTree Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.buildTree).toBeDefined();
});

test('handelShow Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelShow).toBeDefined();
});
test('handleAssignUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handleAssignUsers).toBeDefined();
});

test('assignUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignUsers).toBeDefined();
});

test('setDepartmentManager Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignUsers).toBeDefined();
});

test('unSetDepartmentManager Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignUsers).toBeDefined();
});

test('assignUser Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignUsers).toBeDefined();
});

test('getAvailableUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getAvailableUsers).toBeDefined();
});

test('assignUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignUsers).toBeDefined();
});

test('getAssignedUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getAssignedUsers).toBeDefined();
});

test('SetData Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
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
			<Departments />
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
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.enableFields).toBeDefined();
});

test('_filterTree Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Departments />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance._filterTree).toBeDefined();
});

describe('actions', () => {
	it('should create an action to loadDepartments', () => {
		const data = mockDepData;
		const expectedAction = {
			type: selectActions.LOAD_DEPARTMENTS,
			Departments: data,
		};
		expect(selectActions.setDepartments(data)).toEqual(expectedAction);
	});
});
