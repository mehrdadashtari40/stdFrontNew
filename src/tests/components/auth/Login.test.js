import React from 'react';
import { shallow } from 'enzyme';
import Login from '../../../views/auth/components/Login';
import axios from 'axios';
const puppeteer = require('puppeteer');
jest.mock('react-i18next', () => ({
	withTranslation: () => Component => {
		Component.defaultProps = { ...Component.defaultProps, t: () => '' };
		return Component;
	},
}));
/* Start of SnapShot Test */

test('Make Snapshot file , Login Component', () => {
	const wrapper = shallow(<Login />);
	expect(wrapper).toMatchSnapshot();
});

/* End of SnapShot Test */



/* Start of Ui Component Test */

test('Has a Login Button ? ', () => {
	const wrapper = shallow(<Login />);
	expect(
		wrapper.containsMatchingElement(
			<button type="submit" className="btn_login_page">
				{' '}
				ورود
				<div id="load-container"></div>
			</button>
		)
	).toBe(true);
});

test('Has a Username Text Input ?', () => {
	const wrapper = shallow(<Login />);
	expect(wrapper.containsMatchingElement(<input type="text" />)).toBe(true);
});

test('Has a Password Text Input ?', () => {
	const wrapper = shallow(<Login />);
	expect(wrapper.containsMatchingElement(<input type="password" />)).toBe(true);
});

/* End of Ui Component Test */

/* Start of functional Test */



test('Check Username', () => {
	const wrapper = shallow(<Login />);
	wrapper
		.find('input[type="text"]')
		.simulate('change', { target: { name: 'form[USR_USERNAME]', value: 'testUsername' } });
	expect(wrapper.state('username')).toEqual('testUsername');
});

test('Check Password', () => {
	const wrapper = shallow(<Login />);
	wrapper
		.find('input[type="password"]')
		.simulate('change', { target: { name: 'form[USR_PASSWORD]', value: 'testPassword' } });
	expect(wrapper.state('password')).toEqual('testPassword');
});





test('getToken Function  ', () => {
	const wrapper = shallow(<Login />);
	const instance = wrapper.instance();
	expect(instance.getToken).toBeDefined();
});





/* End of functional Test */




// describe('E2E TEST', () => {
// 	test('Login page loads correctly', async () => {
// 		let browser = await puppeteer.launch({
// 			headless: false,
// 		});
// 		let page = await browser.newPage();

// 		page.emulate({
// 			viewport: {
// 				width: 500,
// 				height: 2400,
// 			},
// 			userAgent: '',
// 		});

// 		await page.goto('http://localhost:3000');
// 		await page.waitForSelector('.login_title_app');
// 		await page.waitForSelector('.login_org_name');
// 		const html_1 = await page.$eval('.login_title_app', e => e.innerHTML);
// 		expect(html_1).toBe('داشبورد جامع مدیریتی');
// 		const html_2 = await page.$eval('.login_org_name', e => e.innerHTML);
// 		expect(html_2).toBe('شرکت آرین نوین رایانه');

// 		browser.close();
// 	}, 16000);
// });




