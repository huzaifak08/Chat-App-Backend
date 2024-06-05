const {createChat,getChat} = require('../controllers/chat_controller');

const router = require('express').Router();

router.route('/createChat').post(createChat);
router.route('/getChat').get(getChat);

module.exports = router; 