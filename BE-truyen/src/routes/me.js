const express = require('express'); 
const router = express.Router();
const meController = require('../app/controllers/MeController');



router.get('/stored/book', meController.storedBook);
router.get('/trash/book', meController.trashBook);


module.exports = router;
