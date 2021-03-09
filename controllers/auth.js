const { request, response } = require("express");
const bcrypt = require('bcrypt');
const generatorPassword = require('generate-password');

const User = require('../models/user');
const { jwtGenerator } = require("../helpers/jwt-generator");
const { googleVerifyToken } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const { email, password} = req.body;

    try {
        // Verificar si el email existe
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ msg: 'Email not found in DB'});

        // Comprobar que el usuario esta activo en la BD
        if (!user.state) return res.status(400).json({ msg: 'Email is not active in DB'});

        // Verificar el password
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if(!isValidPassword) return res.status(400).json({ msg: 'Password is not valid'});

        // Generar el JWT
        const token = await jwtGenerator(user.id);

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Contact with administrator'
        });
    }

}

const googleSingIn = async (req = request, res = response) => {
    const { id_token } = req.body;


    try {
        // const googleUser = await googleVerifyToken(id_token);
        // console.log(googleUser);
        const { name, img, email } = await googleVerifyToken(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            const salt = bcrypt.genSaltSync();

            const data = {
                name,
                email,
                password: bcrypt.hashSync(generatorPassword.generate({ length: 10, numbers: true}), salt),
                img,
                google: true
            }

            user = new User(data);
            await user.save();
        }

        // Si el usuario esta en la BD y esta desactivado
        if (!user.state) return res.status(401).json({ msg: 'User blocked, Contact with administrator'});

        // Generar el JWT
        const token = await jwtGenerator(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Token is not valid'
        });
    }
}

module.exports = {
    login,
    googleSingIn
}