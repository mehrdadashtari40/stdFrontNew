import React from 'react';
import { shallow } from 'enzyme';
import DataTable from '../../../common/tables/components/DataTable2';

const mockData = {
	data: [
		'CASES_COUNT: 0',
		'CASES_COUNT_CANCELLED: 0',
		'CASES_COUNT_COMPLETED: 0',
		'CASES_COUNT_DRAFT: 0',
		'CASES_COUNT_TO_DO: 0',
		'CATEGORY_NAME: null',
		'CATEGORY_UID: null',
		'PROJECT_TYPE: "bpmn"',
		'PRO_CATEGORY: ""',
		'PRO_CATEGORY_LABEL: "- No Category -"',
		'PRO_CREATE_DATE: "1399/02/01 16:39:48"',
		'PRO_CREATE_USER_LABEL: "Administrator admin"',
		'PRO_DEBUG: "0"',
		'PRO_DEBUG_LABEL: "Off"',
		'PRO_DESCRIPTION: "123"',
		'PRO_PARENT: "2683031765e9d910cb642c9035051112"',
		'PRO_STATUS: "ACTIVE"',
		'PRO_STATUS_LABEL: "Active"',
		'PRO_TITLE: "1213"',
		'PRO_TYPE: "NORMAL"',
		'PRO_TYPE_PROCESS: "Public"',
		'PRO_UID: "2683031765e9d910cb642c9035051112"',
		'PRO_UPDATE_DATE: null',
		'USR_FIRSTNAME: "Administrator"',
		'USR_LASTNAME: "admin"',
		'USR_UID: "00000000000000000000000000000001"',
		'USR_USERNAME: "admin"',
	],
	columns: [
		'class: "row-controller process-designer"',
		'data: "PRO_TITLE"',
		'mData: "PRO_TITLE"',
		'sClass: "row-controller process-designer"',
	],
};

/* Start of SnapShot Test */

test('Make Snapshot file , DataTable Component', () => {
	const wrapper = shallow(<DataTable data={mockData} />);

	expect(wrapper).toMatchSnapshot();
});
