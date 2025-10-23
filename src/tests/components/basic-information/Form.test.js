import React from 'react';
import { shallow } from 'enzyme';

import Form from '../../../views/basic-information/components/Form';

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Form Component', () => {
	const wrapper = shallow(
		<Form structure={['test1 : testValue1', 'test2 : testValue2', 'test3 : testValue3', 'test4 : testValue4']} />
	);

	expect(wrapper).toMatchSnapshot();
});
