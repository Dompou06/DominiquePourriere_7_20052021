const express = require('express');
const router = express.Router();
const verifyMessage = require('../middleware/verifyMessage');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const messageCtrl = require('../controllers/message');

router.post('/', auth, verifyMessage, multer, messageCtrl.createMessage);
router.get('/', messageCtrl.getAllMessage);
router.get('/:id', auth, messageCtrl.getOneMessage);
router.delete('/:id', auth, messageCtrl.deleteOneMessage);
router.put('/:id', auth, multer, messageCtrl.updateMessage);

module.exports = router;
