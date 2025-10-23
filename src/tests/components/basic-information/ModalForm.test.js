import React from 'react';
import { shallow } from 'enzyme';

import ModalForm from '../../../views/basic-information/components/ModalForm';

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , DaynamicDataTable Component', () => {
	const wrapper = shallow(<ModalForm />);

	expect(wrapper).toMatchSnapshot();
});
