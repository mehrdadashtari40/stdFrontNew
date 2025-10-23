import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../../views/system-management/SystemManagementActions';
import Users from '../../../../views/system-management/components/users/Users';

// const store = mockStore();

const mockUserData = {
	dep_uid: '8de55952f1d8a7c5f6ed226671bd6c39',
	departmentname: '24.بیمارستان الغدیر ابهر',
	usr_address: 'علوم پزشکی زنجان',
	usr_birthday: null,
	usr_calendar_name: '',
	usr_calendar_uid: '',
	usr_cellular: '',
	usr_city: 'Zn',
	usr_country: 'IR',
	usr_create_date: '2019-04-04 00:00:00',
	usr_due_date: '2099-01-01',
	usr_email: '0061954349',
	usr_fax: '--',
	usr_firstname: '0061954349',
	usr_lastname: '0061954349',
	usr_location: '',
	usr_phone: "'0098'",
	usr_photo_path: '/var/www/html/processmaker/workflow/public_html/images/user.gif',
	usr_position: '',
	usr_replaced_by: '',
	usr_reports_to: '0061954349',
	usr_resume: '0061954349',
	usr_role: 'PROCESSMAKER_ADMIN',
	usr_status: 'ACTIVE',
	usr_uid: '0061954349',
	usr_update_date: '2019-04-04 00:00:00',
	usr_username: '0061954349',
	usr_ux: 'NORMAL',
	usr_zip_code: "'1'",
};

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Users Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Users.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(Users.prototype.componentDidMount).toHaveBeenCalled();
	Users.prototype.componentDidMount.mockRestore();
});


it('searchUser HaveBeenCalled when searchBox change ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'searchUser');

	instance.forceUpdate();

	const input = wrapper.find('#searchBox');
	input.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalled();
});

it('filterUsers HaveBeenCalled ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'filterUsers');

	instance.forceUpdate();

	const Button = wrapper.find('#filterUser');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});


test('getUsers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getUsers).toBeDefined();
});

test('handelEdit Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelEdit).toBeDefined();
});

test('handelIndex Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelIndex).toBeDefined();
});

test('getRefreshStatus Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getRefreshStatus).toBeDefined();
});

test('handelCreate Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelCreate).toBeDefined();
});

test('setNullFiels Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.setNullFiels).toBeDefined();
});

test('handelShow Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
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
			<Users />
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
			<Users />
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
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.enableFields).toBeDefined();
});

test('onSubmit Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Users />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.onSubmit).toBeDefined();
});

describe('actions', () => {
	it('should create an action to loadUser', () => {
		const data = mockUserData;
		const expectedAction = {
			type: selectActions.LOAD_USER,
			User: data,
		};
		expect(selectActions.setUser(data)).toEqual(expectedAction);
	});
});
