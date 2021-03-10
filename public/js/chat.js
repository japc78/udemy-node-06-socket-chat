const endPoint = "/api/auth/";
const dev = "http://localhost:3000"
const production = "https://japc-testing-node-rest-server.herokuapp.com"

const url = (window.location.hostname.includes('localhost'))
    ? dev + endPoint
    : production + endPoint;

let user, socket;


// Html
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');


// Validar el token del localStorage
const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('There is not a valid token')
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    // console.log( await resp.json())
    const { user: userDb, token: tokenDb } = await resp.json();
    localStorage.setItem('token', tokenDb);
    user = userDb;

    document.title = user.name;

    await connectSocket();
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token'),
        }
    });

    socket.on('connect', ()=> {
        console.log('Socket online');
    });

    socket.on('disconnect', ()=> {
        console.log('Socket offline');
    });

    // socket.on('get-messages', (payload) => {
    //     showMessages(payload);
    // });
    // de forma abreviada
    socket.on('get-messages', showMessages);

    socket.on('active-users', (payload) => {
        showUserOnWeb(payload);
    });

    socket.on('get-private-message', () => {

    });
}

const main = async () => {
    await validateJWT();
}

const showUserOnWeb = (users = []) => {
    let usersHtml = '';
    users.forEach(({ name, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>`
    });

    ulUsers.innerHTML = usersHtml;
}

const showMessages = (messages = []) => {
    let messagesHtml = '';
    messages.forEach(({ userName, message }) => {
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${ userName }</span>:
                    <span>${message}</span>
                </p>
            </li>`
    });

    ulMessages.innerHTML = messagesHtml;
}

txtMessage.addEventListener('keyup', ({ keyCode}) => {
    const message = txtMessage.value;
    const uid = txtUid.value;
    // console.log(message);
    // console.log(keyCode);

    if (message.length === 0) { return;}
    // Si no presiona enter
    if (keyCode != 13) { return;}

    socket.emit('send-message', { message, uid });

    txtMessage.value = '';

})

main();


