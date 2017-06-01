'use strict';

module.exports = {
	'googleAuth': {
		'clientID': process.env.GOOGLE_KEY,
		'clientSecret': process.env.GOOGLE_SECRET,
		'callbackURL': '/auth/google/callback'
	}
};
