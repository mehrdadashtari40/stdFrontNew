import React from 'react';
import { shallow } from 'enzyme';
import ScalerChart from '../../../views/new-inbox/components/scaler';
import ServerSideDataTable from '../../../common/tables/components/ServerSideDataTable';
import { Provider } from 'react-redux';
import NewInbox from '../../../views/new-inbox/components/NewInbox';
import store from '../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../views/new-inbox/NewInboxActions';

// const store = mockStore();
jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));
/* Start of SnapShot Test */

test('Make Snapshot file , Newnibox Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});

/* End of SnapShot test */

/*Start of Ui test */

test('Has a ScalerChart ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper.containsMatchingElement(<ScalerChart />)).toBe(true);
});

test('Has a Action Change Radio Button ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper.containsMatchingElement(<input type="radio" name="action" />)).toBe(true);
});

test('Has a Filter Change Radio Button ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper.containsMatchingElement(<input type="radio" name="filter" />)).toBe(true);
});

test('Has a DateFrom Change input ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper.containsMatchingElement(<input className="dateFrom" />)).toBe(true);
});

test('Has a DateTo Change input ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper.containsMatchingElement(<input className="dateTo" />)).toBe(true);
});

test('Has a SearchBar input ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper.containsMatchingElement(<input type="text" className="searchTerm" />)).toBe(true);
});

/*End of Ui test */

/*start of unit test */
it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(NewInbox.prototype, 'componentDidMount');
	shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(NewInbox.prototype.componentDidMount).toHaveBeenCalled();
	NewInbox.prototype.componentDidMount.mockRestore();
});

it('filterData HaveBeenCalled ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'filterData');

	instance.forceUpdate();

	const Button = wrapper.find('.searchButton');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});

it('resetData HaveBeenCalled ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'resetData');

	instance.forceUpdate();

	const Button = wrapper.find('.resetBtn');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});

it('actionChange HaveBeenCalled when radio buttonChanged?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'actionChange');

	instance.forceUpdate();

	const input = wrapper.find('.radioInput').at(0);
	input.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalled();
});

it('filterChange HaveBeenCalled when radio buttonChanged?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'filterChange');

	instance.forceUpdate();

	const input = wrapper.find('.radioInput').at(4);
	input.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalled();
});

it('NewerThan select work Corectly ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();

	const spy = jest.spyOn(instance, 'newerThanChange');

	instance.forceUpdate();

	const select = wrapper.find('.newerThan');
	select.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalledWith({ target: { value: 'test' } });
});

it('processFilter select work Corectly ?', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();

	const spy = jest.spyOn(instance, 'processChange');

	instance.forceUpdate();

	const select = wrapper.find('.processFilter');
	select.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalledWith({ target: { value: 'test' } });
});

/*end of unit test */

/* Start of functional Test */

test('getHistory Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
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
			<NewInbox />
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
			<NewInbox />
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
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getTaskInformation).toBeDefined();
});

test('handelAssignTags Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.handelAssignTags).toBeDefined();
});

test('assignTag Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.assignTag).toBeDefined();
});

test('unAssignTag Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.unAssignTag).toBeDefined();
});

test('getAvailableTags Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getAvailableTags).toBeDefined();
});

test('getSelectedTag Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getSelectedTag).toBeDefined();
});

test('getDataServer Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getDataServer).toBeDefined();
});

test('filterByDraft Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.filterByDraft).toBeDefined();
});

test('filterByParticipated Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.filterByParticipated).toBeDefined();
});

test('filterByUnassigned Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.filterByUnassigned).toBeDefined();
});

test('filterBytoDo Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.filterBytoDo).toBeDefined();
});

test('filterChange Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.filterChange).toBeDefined();
});

test('actionChange Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.actionChange).toBeDefined();
});

test('newerThanChange Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.newerThanChange).toBeDefined();
});

test('processChange Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.processChange).toBeDefined();
});

test('resetData Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.resetData).toBeDefined();
});

test('filterData Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.filterData).toBeDefined();
});

test('getTableRow Function  ', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<NewInbox />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	const instance = wrapper.instance();
	expect(instance.getTableRow).toBeDefined();
});

/* End of functional Test */

/* Start of  Redux Test */

describe('actions', () => {
	it('should create an action to loadScalerData', () => {
		const data = 'test';
		const expectedAction = {
			type: selectActions.FETCH_SCALER_CHART_DATA,
			scalerData: data,
		};

		expect(selectActions.setScalerData(data)).toEqual(expectedAction);
	});

	it('should create an action to loadTreeCase', () => {
		const data = 'test';
		const expectedAction = {
			type: selectActions.FETCH_DROPDOWN_TREE_CASE,
			treeCase: data,
		};

		expect(selectActions.setTreeCase(data)).toEqual(expectedAction);
	});

	it('should create an action to loadTags', () => {
		const data = 'test';
		const expectedAction = {
			type: selectActions.FETCH_TAGS,
			tags: data,
		};

		expect(selectActions.setTags(data)).toEqual(expectedAction);
	});
});


/* End of Redux Test */
