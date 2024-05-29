const express = require('express'); 
const router = express.Router();
const detailsController = require('../app/controllers/SearchsController');



router.get('/:slug', detailsController.detail);
router.post('/', detailsController.index);


module.exports = router;
