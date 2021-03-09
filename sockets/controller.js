const { Socket } = require("socket.io")

const socketController = (socket = new Socket()) => {
    console.log('Client connected', socket.id);
}

module.exports = {
    socketController,
}