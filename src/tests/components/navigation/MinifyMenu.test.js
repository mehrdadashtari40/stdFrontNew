import React from 'react';
import { shallow } from 'enzyme';
import { MinifyMenu } from '../../../common';

test('Make Snapshot file , MinifyMenu Component', () => {
	const wrapper = shallow(<MinifyMenu />);

	expect(wrapper).toMatchSnapshot();
});
