const express = require('express'); 
const router = express.Router();
const detailsController = require('../app/controllers/DetailController');


router.get('/:slug/:id', detailsController.reader);

router.get('/:slug', detailsController.show);


module.exports = router;
