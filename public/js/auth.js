const endPoint = "/api/auth/";
const dev = "http://localhost:3000"
const production = "https://japc-testing-node-rest-server.herokuapp.com"

// console.log(windows.location.hostname.includes('localhost'));
const url = (window.location.hostname.includes('localhost'))
    ? dev + endPoint
    : production + endPoint;
// console.log("url:" + url);


const loginForm = document.querySelector('form');

console.log(loginForm.elements);

loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData =  {}

    for (let element of loginForm.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value;
        }
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json'}
    })
    .then (resp => resp.json())
    .then( ({ msg, token }) => {
        if (msg) return console.error(msg);

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.error(err)
    })


})



function onSignIn(googleUser) {

    // const profile = googleUser.getBasicProfile();
    const id_token = googleUser.getAuthResponse().id_token;
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // console.log('Token Google: ' + id_token);

    const data = { id_token }

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then( resp => resp.json())
    // .then( data => console.log('Our Server', data))
    .then( ({ token }) => {
        // console.log(token);
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })

    .catch(err => console.error(err));
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}