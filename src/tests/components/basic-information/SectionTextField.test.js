import React from 'react';
import { shallow } from 'enzyme';

import SectionTextField from '../../../views/basic-information/components/SectionTextField';

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , SectionTextField Component', () => {
	const wrapper = shallow(<SectionTextField />);

	expect(wrapper).toMatchSnapshot();
});
