import React from 'react';
import { LoginInfo } from '../../../common';
import { shallow } from 'enzyme';
import store from '../../../store/configureStore';
import { Provider } from 'react-redux';

test('Make Snapshot file , LoginInfo Component', () => {
	const wrapper = shallow(
		<Provider store={store}>
			<LoginInfo picture="avatar" username="test" />
		</Provider>
	)
		.dive({ context: { store } })
		.dive();
	expect(wrapper).toMatchSnapshot();
});
