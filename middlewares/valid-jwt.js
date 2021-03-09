const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validJWT = async ( req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) return res.status(401).json( {msg: 'There is not token in the request'} );

    try {
        // Verificar token recibido
        // jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

        const payload = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        // console.log(payload);

        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        req.uid = uid;

        const user = await User.findById(uid);
        if(!user) return res.status(401).json({ msg: 'Token is not valid - User is not exist in Database'});

        // Verifica que el user tiene state=true
        if(!user.state) return res.status(401).json({ msg: 'Token is not valid - user disabled'});

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: 'Token is not valid'});
    }
}

module.exports = {
    validJWT
}