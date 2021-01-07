const bcrypt = require('bcryptjs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaiHttp);
const auth = require('../../middleware/Auth');
const Petitions = require('../../models/Petitions');
const Users = require('../../models/Users');
let app;
let user;
let petition;

before( function(done) {
    // create user, petition and mock auth along with setting request user
    user = new Users({
        name: 'test user',
        email: 'test@test.com',
        password: 1234567
    });
    bcrypt.genSalt(10, (error, salt) =>
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) throw error;
            user.password = hash;
            user.save();
        })
    );
    petition = new Petitions({
        title: 'TEST',
        signaturesNeeded: 20,
        description: 'TEST DESC',
        createdBy: user._id,
        signatures: [user._id]
    })
    petition.save();
    sinon.stub(auth, 'ensureAuthenticated')
        .callsFake(async (req, res, next) => next());
    app = require('../../app');
    app.request.user = user;
    done();
});

after(function() {
    // tear down, clear database and kill connection
    auth.ensureAuthenticated.restore();
    Users.collection.deleteMany({});
    Petitions.collection.deleteMany({});
    setTimeout(() => app.functions.disconnect(), 1000);
});

describe('Test PetitionController', () => {
    it('Test view, should return 200', function(){
        chai.request(app)
            .get('/petition/view/'+petition._id)
            .end(function (err, res) {
                expect(res).to.have.status(200);
            });
    });

    it('Add Petition should add to database',function(){
        chai.request(app)
            .post('/petition/add')
            .send({"title":"TEST", "signaturesNeeded":10, "description":"TEST"})
            .end(async function(err, res) {
                expect(res).to.have.status(200);
                let petition = await Petitions.findOne({title: "TEST"});
                chai.assert.isNotNull(petition);
            });
    });

});