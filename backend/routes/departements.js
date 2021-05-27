const express = require('express');
const router = express.Router();
const departementCtrl = require('../controllers/departements');

router.get('/', departementCtrl.getAllDepartements);

module.exports = router;
