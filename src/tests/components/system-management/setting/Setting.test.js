import React from 'react';
import { shallow } from 'enzyme';
import Setting from '../../../../views/system-management/components/setting/Setting';

// const store = mockStore();

jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));

test('Make Snapshot file , Setting Component', () => {
	const wrapper = shallow(<Setting />);
	expect(wrapper).toMatchSnapshot();
});

it('invokes `componentDidMount` when mounted', () => {
	jest.spyOn(Setting.prototype, 'componentDidMount');
	shallow(<Setting />);
	expect(Setting.prototype.componentDidMount).toHaveBeenCalled();
	Setting.prototype.componentDidMount.mockRestore();
});

it('radioChange HaveBeenCalled when radio buttonChanged?', () => {
	const wrapper = shallow(<Setting />);

	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'radioChange');

	instance.forceUpdate();

	const input = wrapper.find('input').at(0);
	input.simulate('change', { target: { value: 'test' } });
	expect(spy).toHaveBeenCalled();
});
it('saveDefault HaveBeenCalled ?', () => {
	const wrapper = shallow(<Setting />);

	const instance = wrapper.instance();
	const spy = jest.spyOn(instance, 'saveDefault');

	instance.forceUpdate();

	const Button = wrapper.find('button');
	Button.simulate('click');
	expect(spy).toHaveBeenCalled();
});



test('saveDefault Function  ', () => {
	const wrapper = shallow(<Setting />);

	const instance = wrapper.instance();
	expect(instance.saveDefault).toBeDefined();
});
