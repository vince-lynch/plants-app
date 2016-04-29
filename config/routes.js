var router = require('express').Router();
var authController = require('../controllers/authentication');
var apiController = require('../controllers/apicalls');
var secret = require('../config/tokens').secret;

router.post('/auth/facebook', authController.facebook);
router.post('/auth/github', authController.github);
router.post('/auth/instagram', authController.instagram);



// route for detailed city data
router.get('/api/plants', apiController.getAll);
router.route('/api/plants').post(apiController.create);

router.route('/api/plants/:email')
  .get(apiController.show)
  .put(apiController.update)
  .delete(apiController.delete);

router.route('/api/plantslocation/:email').put(apiController.locationUpdate);
  

module.exports = router;