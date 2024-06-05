const {createChat} = require('../controllers/chat_controller');

const router = require('express').Router();

router.route('/createChat').post(createChat);

module.exports = router; 