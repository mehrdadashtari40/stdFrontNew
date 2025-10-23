import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../views/process-management/ProcessManagementActions';
import Design from '../../../views/process-management/components/Design';

const mokeData = [
	{
		PRO_UID: '2683031765e9d910cb642c9035051112',
		PRO_TITLE: '1213',
		PRO_DESCRIPTION: '123',
		PRO_PARENT: '2683031765e9d910cb642c9035051112',
		PRO_STATUS: 'ACTIVE',
		PRO_TYPE: 'NORMAL',
		PRO_CATEGORY: '',
		PRO_UPDATE_DATE: null,
		PRO_CREATE_DATE: '1399/02/01 16:39:48',
		PRO_DEBUG: '0',
		PRO_TYPE_PROCESS: 'Public',
		USR_UID: '00000000000000000000000000000001',
		USR_USERNAME: 'admin',
		USR_FIRSTNAME: 'Administrator',
		USR_LASTNAME: 'admin',
		CATEGORY_UID: null,
		CATEGORY_NAME: null,
		PROJECT_TYPE: 'bpmn',
		PRO_CATEGORY_LABEL: '- No Category -',
		PRO_DEBUG_LABEL: 'Off',
		PRO_STATUS_LABEL: 'Active',
		PRO_CREATE_USER_LABEL: 'Administrator admin',
		CASES_COUNT_TO_DO: 0,
		CASES_COUNT_COMPLETED: 0,
		CASES_COUNT_DRAFT: 0,
		CASES_COUNT_CANCELLED: 0,
		CASES_COUNT: 0,
	},
];

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Design Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Design.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(Design.prototype.componentDidMount).toHaveBeenCalled();
	Design.prototype.componentDidMount.mockRestore();
});

it('exportProcess HaveBeenCalled ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'exportProcess');

	instance.forceUpdate();

	const Button = wrapper.find('#exportProcess');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});

// it('handleAssignVariable HaveBeenCalled ?', () => {
// 	const wrapper = shallow(
// 		<Provider store={store}>
// 			<Design />
// 		</Provider>
// 	)
// 		.dive({ context: { store } })
// 		.dive();
// 	const instance = wrapper.instance();
// 	const spy = jest.spyOn(instance, 'handleAssignVariable');

// 	instance.forceUpdate();

// 	const Button = wrapper.find('#handleAssignVariable');
// 	Button.simulate('click');
// 	expect(spy).toHaveBeenCalled();
// });

it('deactivateProcess HaveBeenCalled ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'deactivateProcess');

	instance.forceUpdate();

	const Button = wrapper.find('#deactivateProcess');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});

it('deleteProcess HaveBeenCalled ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'deleteProcess');

	instance.forceUpdate();

	const Button = wrapper.find('#deleteProcess');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});

it('deleteCases HaveBeenCalled ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'deleteCases');

	instance.forceUpdate();

	const Button = wrapper.find('#deleteCases');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});

test('exportProcess Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.exportProcess).toBeDefined();
});

test('downloadFile Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.downloadFile).toBeDefined();
});

test('importProject Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.importProject).toBeDefined();
});

test('selectFieldsOfProcess Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.selectFieldsOfProcess).toBeDefined();
});

test('renderSwitch Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.renderSwitch).toBeDefined();
});

test('onSubmit Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.onSubmit).toBeDefined();
});

test('deactivateProcess Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.deactivateProcess).toBeDefined();
});

test('deleteCases Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.deleteCases).toBeDefined();
});

test('handleAssignVariable Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handleAssignVariable).toBeDefined();
});

test('getAvailableVariables Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getAvailableVariables).toBeDefined();
});

test('getTasks Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getTasks).toBeDefined();
});

test('getAssignedVariables Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getAssignedVariables).toBeDefined();
});

test('assignVariables Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignVariables).toBeDefined();
});

test('assignVariable Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignVariable).toBeDefined();
});

test('unassignVariable Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.unassignVariable).toBeDefined();
});

test('setDefaultVariable Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.setDefaultVariable).toBeDefined();
});

test('setGroupsMembers Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<Design />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.setGroupsMembers).toBeDefined();
});

describe('actions', () => {
	it('should create an action to insertNew', () => {
		const data = mokeData;
		const expectedAction = {
			type: selectActions.INSERT_NEW,
			data: data,
		};

		expect(selectActions.setInsertNewData(data)).toEqual(expectedAction);
	});

	it('should create an action to getProcessList', () => {
		const data = mokeData;
		const expectedAction = {
			type: selectActions.GET_PROCESS_LIST,
			data: data,
		};

		expect(selectActions.setProcessList(data)).toEqual(expectedAction);
	});

	it('should create an action to getCategories', () => {
		const data = mokeData;
		const expectedAction = {
			type: selectActions.GET_CATEGORIES,
			categories: data,
		};

		expect(selectActions.setCategories(data)).toEqual(expectedAction);
	});

	it('should create an action to deactivateProcess', () => {
		const data = mokeData;
		const expectedAction = {
			type: selectActions.DEACTIVE_PROCESS,
			data: data,
		};

		expect(selectActions.setDeactivateProcess(data)).toEqual(expectedAction);
	});

	it('should create an action to deleteProcess', () => {
		const data = mokeData;
		const expectedAction = {
			type: selectActions.DELETE_PROCESS,
			data: data,
		};

		expect(selectActions.setDeleteProcess(data)).toEqual(expectedAction);
	});
});
