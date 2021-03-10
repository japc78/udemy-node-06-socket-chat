const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers/jwt-generator");
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketController = async (socket = new Socket(), io ) => {
    console.log('Client connected', socket.id);
    // console.log(socket);
    // console.log(socket.handshake.headers['x-token']);
    const user = await checkJWT(socket.handshake.headers['x-token']);

    if (!user) return socket.disconnect();
    // console.log(`User: ${user.name} connected`);

    // Agregar el usuario conectado
    chatMessages.connectUser(user);
    io.emit('active-users',  chatMessages.usersArray );

    // Limpiar cuando un usuario de desconecta
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.uid);
        io.emit('active-users',  chatMessages.usersArray );
    });

    socket.on('send-message', ({ message, uid }) => {
        chatMessages.sendMessage(user.uid, user.name, message);
        io.emit('get-messages', chatMessages.last10);
    });



}

module.exports = {
    socketController,
}