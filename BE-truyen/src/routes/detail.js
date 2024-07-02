const express = require('express'); 
const router = express.Router();
const detailsController = require('../app/controllers/DetailController');
const updateChapterViews = require('../app/middleware/updateChapterViews')
const {authenticateTokens} = require('../app/middleware/auth');
const {updateReadingProgress} = require('../app/middleware/chap')
const a = require('../app/middleware/getClientIp')
router.use(a);
router.get('/:slug/:id',authenticateTokens,updateReadingProgress,updateChapterViews, detailsController.reader);
router.get('/api/get-reading-progress/all',authenticateTokens,detailsController.csss);
router.get('/:slug', detailsController.show);

// status
// router.post('/:slug/like', detailsController.like);
// router.post('/:slug/like', detailsController.follow);
// router.post('/:slug/readed', detailsController.readed);
module.exports = router;
