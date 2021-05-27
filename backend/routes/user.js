const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const verifyUser = require('../middleware/verifyUser');
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const limiter = require('../middleware/limit');

router.post('/signup', multer, verifyUser, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);
router.get('/userid', auth, userCtrl.user);
router.get('/profil/:author', userCtrl.profil);
router.delete('/delete/:user', userCtrl.delete);
router.put('/update/:user', multer, userCtrl.update);
//router.get('/admin/:user', userCtrl.admin);
module.exports = router;