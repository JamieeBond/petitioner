const chai = require('chai');
const expect = chai.expect;
const PetitionValidator =  require('../../validator/PetitionValidator');
const UserValidator =  require('../../validator/UserValidator');

describe('PetitionValidator', function () {

	describe('add', function(){

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

describe('UserValidator', function () {

	describe('registration', function(){

		it('No fields expects 2 errors', function(){
			var errors = UserValidator.registration('', '', '', '')
			expect(errors.length).equal(2);
		});

		it('Password not matching expects 1 error', function(){
			var errors = UserValidator.registration('Jamie', 'jamie@jamie.com', 'eddwdweef', 'fef')
			expect(errors.length).equal(1);
		});

		it('Password less than 6 expects 1 error', function(){
			var errors = UserValidator.registration('Jamie', 'jamie@jamie.com', 'eddwdweef', 'fef')
			expect(errors.length).equal(1);
		});

		it('All fields correct expects 0 errors', function(){
			var errors = UserValidator.registration('Jamie', 'jamie@jamie.com', 'eddwdweef', 'eddwdweef')
			expect(errors.length).equal(0);
		});
	});

});