const express = require('express'); 
const router = express.Router();
const meController = require('../app/controllers/MeController');
const {authenticateTokenss} = require('../app/middleware/auth')


router.get('/stored/:userId/book',authenticateTokenss, meController.storedBooks);
router.get('/trash/book',authenticateTokenss, meController.trashBook);


module.exports = router;
