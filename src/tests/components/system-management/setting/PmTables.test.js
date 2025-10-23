import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../../store/configureStore';
import configureStore from 'redux-mock-store';
import * as selectActions from '../../../../views/system-management/SystemManagementActions';
import PmTables from '../../../../views/system-management/components/setting/PmTables';

// const store = mockStore();

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , PmTables Component', () => {
	const wrapper = shallow(<PmTables/>);
	expect(wrapper).toMatchSnapshot();
});
