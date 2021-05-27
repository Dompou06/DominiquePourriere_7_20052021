const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
//En production
/*
const auth = require('../middleware/auth');
router.post('/', auth, likeCtrl.likeDislike);
*/
// En developpement
router.post('/:id', likeCtrl.likeDislike);
module.exports = router;
