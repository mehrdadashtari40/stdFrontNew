import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../store/configureStore';
import DaynamicDataTable from '../../../views/basic-information/components/DynamicDataTable';

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , DaynamicDataTable Component', () => {
	const wrapper = shallow(
		<DaynamicDataTable
			structure={['test1 : testValue1', 'test2 : testValue2', 'test3 : testValue3', 'test4 : testValue4']}
			data={['test : testValue', 'id : 11111']}
		/>
	);

	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(DaynamicDataTable.prototype, 'componentDidMount');
	shallow(
		<DaynamicDataTable
			structure={['test1 : testValue1', 'test2 : testValue2', 'test3 : testValue3', 'test4 : testValue4']}
			data={['test : testValue', 'id : 11111']}
		/>
	);

	expect(DaynamicDataTable.prototype.componentDidMount).toHaveBeenCalled();
	DaynamicDataTable.prototype.componentDidMount.mockRestore();
});

it('invokes `componentWillMount` when mounted', () => {
	jest.spyOn(DaynamicDataTable.prototype, 'componentWillMount');
	shallow(
		<DaynamicDataTable
			structure={['test1 : testValue1', 'test2 : testValue2', 'test3 : testValue3', 'test4 : testValue4']}
			data={['test : testValue', 'id : 11111']}
		/>
	);

	expect(DaynamicDataTable.prototype.componentWillMount).toHaveBeenCalled();
	DaynamicDataTable.prototype.componentWillMount.mockRestore();
});


it('invokes `shouldComponentUpdate` when mounted', () => {
	jest.spyOn(DaynamicDataTable.prototype, 'shouldComponentUpdate');
	shallow(
		<DaynamicDataTable
			structure={['test1 : testValue1', 'test2 : testValue2', 'test3 : testValue3', 'test4 : testValue4']}
			data={['test : testValue', 'id : 11111']}
		/>
	);

	expect(DaynamicDataTable.prototype.shouldComponentUpdate).toHaveBeenCalled();
	DaynamicDataTable.prototype.shouldComponentUpdate.mockRestore();
});
