import React from 'react';
import { shallow } from 'enzyme';
import Spinner from '../../../common/Spinner/Spinner';

test('Make Snapshot file , Spinner Component', () => {
	const wrapper = shallow(<Spinner />);

	expect(wrapper).toMatchSnapshot();
});
