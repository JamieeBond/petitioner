const PetitionValidator = {
	addPetition(title, signaturesNeeded, description) {
		let errors = []

		// check required fields
		if (!title || !signaturesNeeded || !description) {
			errors.push({msg: 'Please enter all fields'});
		}

		if (signaturesNeeded && isNaN(signaturesNeeded)) {
			errors.push({msg: 'Signatures needed must be a number'});
		}

		return errors;
	}
}

module.exports = PetitionValidator;