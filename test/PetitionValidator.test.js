const chai = require('chai');
const expect = chai.expect;
const PetitionValidator =  require('../validator/PetitionValidator');

describe('UserValidator', function () {

	describe('registration', function(){

		it('No fields expects 1 error', function(){
			var errors = PetitionValidator.addPetition('', '', '')
			expect(errors.length).equal(1);
		});

		it('Signatures needed not a number expects 1 error', function(){
			var errors = PetitionValidator.addPetition('Test', 'o', 'Test')
			expect(errors.length).equal(1);
		});

		it('All correct expects 0 errors', function(){
			var errors = PetitionValidator.addPetition('Test', 3, 'Test')
			expect(errors.length).equal(0);
		});
	});

});