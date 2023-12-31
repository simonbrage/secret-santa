const express = require('express');
const router = express.Router();
const controller = require('./controllers');

router.post('/create-room', controller.createRoom);
router.post('/join-room', controller.joinRoom);
router.post('/start-game', controller.startGame);
router.post('/place-gift', controller.placeGift);
router.get('/room/:roomId', controller.getRoomState);
router.delete('/delete-room', controller.deleteRoom);

module.exports = router;
