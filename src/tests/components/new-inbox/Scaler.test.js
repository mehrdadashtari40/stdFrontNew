import React from 'react';
import { shallow } from 'enzyme';
import ScalerChart from '../../../views/new-inbox/components/scaler';

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));
/* Start of SnapShot Test */

test('Make Snapshot file , ScalerChart Component', () => {
	const wrapper = shallow(<ScalerChart title="test title" value="test value" unit="test unit" />);
	expect(wrapper).toMatchSnapshot();
});
