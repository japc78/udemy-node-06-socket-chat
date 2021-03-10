const jwt = require('jsonwebtoken');
const { User} = require('../models');

const jwtGenerator = (uid = '') => {
    return new Promise ((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.SECRET_OR_PRIVATE_KEY,
            { expiresIn: '1h' },
            ( err, token) => {
                if (err) {
                    console.log(err);
                    reject('Token could not be generated')
                } else {
                    resolve(token);
                }
            }
        );
    });
}

const checkJWT = async(token = '') => {
    try {
        if (token.length < 10 ) return null;

        const {uid} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const user = await User.findById(uid);

        return (user && user.state === true) ? user : null;
    } catch (error) {
        return null
    }
}

module.exports = {
    jwtGenerator,
    checkJWT
}