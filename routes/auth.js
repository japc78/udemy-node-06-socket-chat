const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSingIn, renewJWT } = require('../controllers/auth');

const { validFields } = require('../middlewares/valid-fields');
const { validJWT } = require('../middlewares');

const router = Router();

router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
    validFields

],login);

router.post('/google',[
    check('id_token', 'Id_token is required').notEmpty(),
    validFields
],googleSingIn);


router.get('/', validJWT, renewJWT );

module.exports = router;