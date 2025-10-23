import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../../views/system-management/SystemManagementActions';
import Groups from '../../../../views/system-management/components/users/Groups';

const mockGroupData = {
	grp_status: 'ACTIVE',
	grp_tasks: 2,
	grp_title: 'AUTO_آرشیو نامه ها',
	grp_uid: '7372551305a59d8f8c73f52010019622',
	grp_users: 6,
};

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Groups Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Groups.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(Groups.prototype.componentDidMount).toHaveBeenCalled();
	Groups.prototype.componentDidMount.mockRestore();
});

test('handelIndex Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
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
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelCreate).toBeDefined();
});

test('handelAssignUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelAssignUsers).toBeDefined();
});

test('handelShow Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
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
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.SetData).toBeDefined();
});

test('enableFields Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.enableFields).toBeDefined();
});

test('disableFields Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.disableFields).toBeDefined();
});

test('assignUser Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignUser).toBeDefined();
});

test('unAssignUser Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.unAssignUser).toBeDefined();
});

test('setGroupsMembers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.setGroupsMembers).toBeDefined();
});

test('handelDelete Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelDelete).toBeDefined();
});

test('getAvailableUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getAvailableUsers).toBeDefined();
});

test('closeAssignUserModal Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Groups />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.closeAssignUserModal).toBeDefined();
});

describe('actions', () => {
	it('should create an action to loadGroups', () => {
		const data = mockGroupData;
		const expectedAction = {
			type: selectActions.LOAD_GROUPS,
			Groups: data,
		};
		expect(selectActions.setGroups(data)).toEqual(expectedAction);
	});
});
