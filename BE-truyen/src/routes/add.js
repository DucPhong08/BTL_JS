const express = require('express'); 
const router = express.Router();
const addsController = require('../app/controllers/AddsController');



router.get('/:slug/list', addsController.show);
router.get('/:slug/addlist', addsController.fang);
router.post('/:slug/addlistbook', addsController.add);
router.get('/:slug/:id/editchap', addsController.edit);
router.put('/:slug/:id', addsController.update);
router.delete('/:slug/:id', addsController.destroy);
// router.post('/:slug/like', addsController.like);






module.exports = router;
