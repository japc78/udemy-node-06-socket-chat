const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleVerifyToken = async( idToken = '') =>  {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    // const payload = ticket.getPayload();
    const { name, picture: img, email } = ticket.getPayload();

    return { name, img , email };
}

module.exports = {
    googleVerifyToken
}