import React from 'react';
import { shallow } from 'enzyme';
import { Navigation } from '../../../common';

test('Make Snapshot file , Navigation Component', () => {
	const wrapper = shallow(<Navigation />);

	expect(wrapper).toMatchSnapshot();
});
