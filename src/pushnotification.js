import firebase from 'firebase';

export const initializeFirebase = () => {
	firebase.initializeApp({
		apiKey: 'AIzaSyCgjjC-ktGIKIphoCTS_2W7YntEcqjlFsg',
		authDomain: 'notiftest-63cbd.firebaseapp.com',
		databaseURL: 'https://notiftest-63cbd.firebaseio.com',
		projectId: 'notiftest-63cbd',
		storageBucket: 'notiftest-63cbd.appspot.com',
		messagingSenderId: '137494562885',
		appId: '1:137494562885:web:9641283c85ac98d1d2bb2c',
		measurementId: 'G-KXT9R6Q4WX',
	});
};
export const askForPermissioToReceiveNotifications = async () => {
	try {
		const messaging = firebase.messaging();
		await messaging.requestPermission();
		messaging.onMessage(function(payload) {
		});
		const token = await messaging.getToken();
		localStorage.setItem('fcm-token' , token)
		return token;
	} catch (error) {
		// console.error(error);
	}
};
