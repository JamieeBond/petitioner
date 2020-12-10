const UserValidator = {
	registration(name, email, password, passwordCon) {
		let errors = []

		// check required fields
		if (!name || !email || !password || !passwordCon) {
			errors.push({ msg: 'Please enter all fields' });
		}

		// check passwords match
		if (password !== passwordCon) {
			errors.push({ msg: 'Passwords do not match' });
		}

		// check password length
		if (password.length < 6) {
			errors.push({ msg: 'Password must be at least 6 characters' });
		}

		return errors;
	}
}

module.exports = UserValidator;