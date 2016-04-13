var router = require('express').Router();
var authController = require('../controllers/authentication');
var apiController = require('../controllers/apicalls');
var secret = require('../config/tokens').secret;

router.post('/auth/facebook', authController.facebook);
router.post('/auth/github', authController.github);
router.post('/auth/instagram', authController.instagram);



// route for detailed city data
router.get('/api/numtable/:city/:country', apiController.numtable);

router.get('/api/idealista', apiController.idealista);

router.get('/api/idealIndivAd/:id', apiController.idealistaIndividualAD);

router.get('/api/properties', apiController.getAll);



module.exports = router;