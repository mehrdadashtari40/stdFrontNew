import React from 'react';
import { shallow } from 'enzyme';
import  {NavMenu } from '../../../common';

test('Make Snapshot file , NavMenu Component', () => {
	const wrapper = shallow(<NavMenu />);

	expect(wrapper).toMatchSnapshot();
});
