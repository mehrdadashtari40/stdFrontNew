import React from 'react';
import { shallow } from 'enzyme';
import ProcessInfo from '../../../views/inbox/components/ProcessInfo';
jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));
test('Make Snapshot file , ProcessInfo Component', () => {
	let fakeProcessInfo = {
		PRO_UID: '1271994115e57596c953e45081760466',
		PRO_ID: 77,
		PRO_TITLE: 'test-unassigned',
		PRO_DESCRIPTION: 'test unassigned',
		PRO_PARENT: '1271994115e57596c953e45081760466',
		PRO_TIME: 1,
		PRO_TIMEUNIT: 'DAYS',
		PRO_STATUS: 'ACTIVE',
		PRO_TYPE_DAY: '',
		PRO_TYPE: 'NORMAL',
		PRO_ASSIGNMENT: 'FALSE',
		PRO_SHOW_MAP: 0,
		PRO_SHOW_MESSAGE: 0,
		PRO_SUBPROCESS: 0,
		PRO_TRI_CREATE: '',
		PRO_TRI_OPEN: '',
		PRO_TRI_DELETED: '',
		PRO_TRI_CANCELED: '',
		PRO_TRI_PAUSED: '',
		PRO_TRI_REASSIGNED: '',
		PRO_TRI_UNPAUSED: '',
		PRO_TYPE_PROCESS: 'PUBLIC',
		PRO_SHOW_DELEGATE: 0,
		PRO_SHOW_DYNAFORM: 0,
		PRO_CATEGORY: '9111058575ce9344879c237056865651',
		PRO_SUB_CATEGORY: '',
		PRO_INDUSTRY: 0,
		PRO_UPDATE_DATE: '2020-02-27 09:27:11',
		PRO_CREATE_DATE: '2020-02-27 09:23:48',
		PRO_CREATE_USER: '00000000000000000000000000000001',
		PRO_HEIGHT: 5000,
		PRO_WIDTH: 10000,
		PRO_TITLE_X: 0,
		PRO_TITLE_Y: 0,
		PRO_DEBUG: 0,
		PRO_DYNAFORMS: false,
		PRO_DERIVATION_SCREEN_TPL: '',
		PRO_COST: 0,
		PRO_UNIT_COST: '',
		PRO_ITEE: 1,
		PRO_CATEGORY_LABEL: 'شرکت آرین',
		PRO_BPMN: 1,
		PRO_AUTHOR: 'Administrator admin',
	};

	const wrapper = shallow(<ProcessInfo processInfo={fakeProcessInfo} />);
	expect(wrapper).toMatchSnapshot();
});
