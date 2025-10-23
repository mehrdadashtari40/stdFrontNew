import React from 'react';
import { shallow } from 'enzyme';
import { BigBreadcrumbs } from '../../../common';

test('Make Snapshot file , BigBreadcrumbs Component', () => {
	const wrapper = shallow(<BigBreadcrumbs />);

	expect(wrapper).toMatchSnapshot();
});
