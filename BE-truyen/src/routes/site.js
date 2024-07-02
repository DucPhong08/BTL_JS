const express = require('express'); 
const router = express.Router();
const sitesController = require('../app/controllers/SiteControler');


router.get('/dang-truyen', sitesController.postsss);
router.post('/dang-truyen/list', sitesController.list);
router.get('/book/:id/edit', sitesController.edit);
router.put('/book/:id', sitesController.update);
router.patch('/book/:id/restore', sitesController.restore);
router.delete('/book/:id', sitesController.destroy);
router.delete('/book/:id/force', sitesController.forceDestroy);
router.get('/:slug', sitesController.read);
router.get('/', sitesController.index);


module.exports = router;
