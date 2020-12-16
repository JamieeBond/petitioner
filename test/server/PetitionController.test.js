const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const mongoose = require('mongoose');

// don't create app right away
let app;
const auth = require('../../middleware/Auth');

const { expect } = chai;
chai.use(chaiHttp);

describe('Test PetitionController', () => {

    beforeEach(function() {
        sinon.stub(auth, 'ensureAuthenticated')
            .callsFake(async (req, res, next) => next());
        app = require('../../app');
    });

    afterEach(function() {
        auth.ensureAuthenticated.restore();
    });

    it('Should return status 200',function(){
        chai.request(app)
            .get('/petition/view/5fce8804b180750b157c18dd')
            .then(function(response) {
                expect(response).to.have.status(200);
            });
    });

});