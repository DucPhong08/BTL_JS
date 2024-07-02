const express = require('express'); 
const router = express.Router();
const sitesController = require('../app/controllers/SiteControler');
const authController = require('../app/controllers/AuthControler');
const {authenticateToken,authenticateTokenss}= require('../app/middleware/auth');





router.get('/the-loai', sitesController.category); 
router.get('/search', sitesController.search);
router.get('/rankfollow', sitesController.rankfollow);
router.get('/rankread', sitesController.rankread);
router.get('/rankcomment', sitesController.rankcomment);
router.get('/fullbook', sitesController.fullbook);


router.get('/dang-truyen',authenticateTokenss, sitesController.postsss);
router.post('/dang-truyen/list',authenticateTokenss, sitesController.list);
router.get('/book/:id/edit', sitesController.edit);
router.put('/book/:id', sitesController.update);
router.patch('/book/:id/restore', sitesController.restore);
router.delete('/book/:id', sitesController.destroy);
router.post('/book/:id/force', sitesController.forceDestroy);
// login

router.post('/login',authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/follow/:storyId', authenticateToken,authController.follow);
router.delete('/unfollow/:storyId', authenticateToken,authController.unfollow);
router.get('/user/:name/following',authenticateTokenss, authController.storefollow)
router.post('/like/:storyId', authenticateToken,authController.likeStory);
router.post('/comment/:aaaaaaaaa', authenticateTokenss,authController.comment);
router.get('/history/:abc', authenticateTokenss,authController.storehistory);
router.delete('/unhistory/:abcd', authenticateToken,authController.unhistory);
router.get('/personal/:abcdef', authenticateTokenss,authController.personal);
router.post('/updatepersonal/:gh', authenticateTokenss,authController.updateperson);

// end login
router.get('/:slug', sitesController.read);
router.get('/', sitesController.index);


module.exports = router;
