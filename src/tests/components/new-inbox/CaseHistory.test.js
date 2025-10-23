import React from 'react';
import { shallow } from 'enzyme';
import CaseHistory from '../../../views/inbox/components/CaseHistory';
jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));
test('Make Snapshot file , CaseHistory Component', () => {
	let fakeCaseHistory = [
		{
			tas_uid: '3232592545e575a11045055091238715',
			tas_title: 'Task 2',
			tas_description: '',
			tas_start: 0,
			tas_type: 'NORMAL',
			tas_derivation: 'NORMAL',
			tas_assign_type: 'SELF_SERVICE',
			usr_uid: '00000000000000000000000000000001',
			usr_username: 'admin',
			usr_firstname: 'Administrator',
			usr_lastname: 'admin',
			delegations: [
				{
					del_index: 2,
					del_init_date: '1398/12/08 14:29:38',
					del_task_due_date: '1398/12/09 14:29:30',
					del_finish_date: 'Not finished',
					del_duration: 'Not finished',
					usr_uid: '00000000000000000000000000000001',
					usr_username: 'admin',
					usr_firstname: 'Administrator',
					usr_lastname: 'admin',
				},
			],
		},
	];

	const wrapper = shallow(<CaseHistory caseHistories={fakeCaseHistory} />);
	expect(wrapper).toMatchSnapshot();
});
