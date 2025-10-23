import React from 'react';
import { shallow } from 'enzyme';
import Backup from '../../../../views/system-management/components/backup/Backup';
jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Backup Component', () => {
	const wrapper = shallow(<Backup />);
	expect(wrapper).toMatchSnapshot();
});

it('backup HaveBeenCalled ?', () => {
	const wrapper = shallow(<Backup />);

	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'backup');

	instance.forceUpdate();

	const Button = wrapper.find('button');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});

test('backup Function  ', () => {
	const wrapper = shallow(<Backup />);
	const instance = wrapper.instance();
	expect(instance.backup).toBeDefined();
});

test('downloadFile Function  ', () => {
	const wrapper = shallow(<Backup />);
	const instance = wrapper.instance();
	expect(instance.downloadFile).toBeDefined();
});
