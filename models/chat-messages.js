const Message = require("./chat-message");

class ChatMessages {
    constructor() {
        this.messages = [];
        this.users = {}
    }

    get last10() {
        this.messages = this.messages.splice(0,10);
        return this.messages;
    }

    get usersArray() {
        return Object.values(this.users);
    }

    sendMessage( uid, userName, message) {
        this.messages.unshift( new Message(uid, userName, message) );
    }

    connectUser( user) {
        this.users[user.id]  = user;
    }

    disconnectUser( uid) {
        delete this.users[uid];
    }
}

module.exports = ChatMessages;