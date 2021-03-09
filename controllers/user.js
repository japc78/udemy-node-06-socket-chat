const { response, request } = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');


const userGet = async (req = request, res = response) => {
    const { limit = 5 , from = 0, state = true, google = false } = req.query;

    const query = { google,  state } // Condición del query,

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query, 'name email role')
            .skip(Number(from)) // desde donde se muestran los resultados
            .limit(Number(limit)) // Limite 5
    ])

    res.json({
        total,
        users
    });
}

const userPost = async (req = request, res = response) => {
    // const body = req.body;
    const { name, email, password, role } = req.body;
    const user = new User({name, email, password, role});

    // Encriptar el password
    // Se crea un salt para aumentar la dificultad del password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt)

    // Guardar usuario en BD
    await user.save();

    res.json({
        user
    })
}

const userPut = async (req = request, res = response) => {

    const { id } = req.params;

    const { password, google, email, ...restData } = req.body;

    // TODO Validar en la BD
    if (password) {
        // Encriptar el password
        // Se crea un salt para aumentar la dificultad del password
        const salt = bcrypt.genSaltSync();
        restData.password = bcrypt.hashSync(password, salt)
    }

    const user = await User.findByIdAndUpdate(id, restData, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                err
            });
        }

        return userDb;
    });

    res.json({
        user
    });
}

const userDelete = async (req = request, res = response) => {
    const { id } = req.params;

    // A traves del request se recibe el uid del usuario que realiza la petición, que se obtiene del payload del token.
    // const uid = req.uid;

    const changeState = {
        state: false
    }

    // const authenticatedUser = req.user;

    await User.findByIdAndUpdate(id, changeState, { new: true },  (err, userDb) => {
        if (err) {
            return res.status(400).json({
                err
            });
        }

        res.json({
            userDb,
            // authenticatedUser
            // uid
        });
    });
}

const userPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controller'
    })
}

module.exports =  {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
}