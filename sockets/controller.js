const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers/jwt-generator");

const socketController = async (socket = new Socket()) => {
    console.log('Client connected', socket.id);
    // console.log(socket);
    // console.log(socket.handshake.headers['x-token']);
    const user = await checkJWT(socket.handshake.headers['x-token']);

    if (!user) return socket.disconnect();
    console.log(`User: ${user.name} connected`);
}

module.exports = {
    socketController,
}