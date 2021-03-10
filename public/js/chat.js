const endPoint = "/api/auth/";
const dev = "http://localhost:3000"
const production = "https://japc-testing-node-rest-server.herokuapp.com"

const url = (window.location.hostname.includes('localhost'))
    ? dev + endPoint
    : production + endPoint;

let user, socket;

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
}

const main = async () => {
    await validateJWT();
}

main();

// const socket = io();

